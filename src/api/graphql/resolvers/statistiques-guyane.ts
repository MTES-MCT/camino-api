import * as camelcase from 'camelcase'
import { debug } from '../../../config/index'
import { titresGet } from '../../../database/queries/titres'
import { titresActivitesGet } from '../../../database/queries/titres-activites'
import { ITitre, ITitreActivite } from '../../../types'
import { titresArrayBuild } from './statistiques'

const statistiquesGuyaneActivitesGet = (
  titresActivites: ITitreActivite[],
  init: { [key: string]: number }
) =>
  titresActivites.reduce((acc: { [key: string]: number }, ta) => {
    acc.rapportProductionOrCount++
    if (ta.statutId === 'dep') acc.activitesDeposesQuantiteCount++
    Object.keys(acc).forEach(prop => {
      if (
        ta.contenu &&
        ta.contenu.renseignements &&
        ta.contenu.renseignements[prop] &&
        (prop !== 'effectifs' ||
          ta.titre!.typeId === 'axm' ||
          ta.titre!.typeId === 'pxm' ||
          ta.titre!.typeId === 'cxm')
      ) {
        const value = ta.contenu!.renseignements[prop]
        acc[prop] += Math.abs(Number(value))
      }
    })

    return acc
  }, init)

type IStatsGuyaneTitresTypes =
  | 'titresArm'
  | 'titresPrm'
  | 'titresAxm'
  | 'titresPxm'
  | 'titresCxm'

const statistiquesGuyaneTitresGet = (
  titres: { id: string; typeId: string; surface: number }[]
) =>
  titres.reduce(
    (acc, titre) => {
      const id = camelcase(`titres-${titre.typeId}`) as IStatsGuyaneTitresTypes

      acc[id].quantite++
      acc[id].surface += titre.surface

      return acc
    },
    {
      titresArm: { quantite: 0, surface: 0 },
      titresPrm: { quantite: 0, surface: 0 },
      titresAxm: { quantite: 0, surface: 0 },
      titresPxm: { quantite: 0, surface: 0 },
      titresCxm: { quantite: 0, surface: 0 }
    }
  )

const statistiquesGuyaneInstantBuild = (titres: ITitre[]) => {
  const statsInstant = titres.reduce(
    (acc, titre) => {
      if (
        titre.statutId &&
        ['val', 'mod'].includes(titre.statutId) &&
        titre.surfaceEtape &&
        titre.surfaceEtape.surface
      ) {
        if (['arm', 'prm'].includes(titre.typeId)) {
          acc.surfaceExploration += titre.surfaceEtape.surface
        } else {
          acc.surfaceExploitation += titre.surfaceEtape.surface
        }
        const id = camelcase(
          `titres-${titre.typeId}`
        ) as IStatsGuyaneTitresTypes

        acc[id]++
      }

      return acc
    },
    {
      surfaceExploration: 0,
      surfaceExploitation: 0,
      titresArm: 0,
      titresPrm: 0,
      titresAxm: 0,
      titresPxm: 0,
      titresCxm: 0
    }
  )

  statsInstant.surfaceExploration = Math.floor(
    statsInstant.surfaceExploration * 100
  ) // conversion 1 km² = 100 ha
  statsInstant.surfaceExploitation = Math.floor(
    statsInstant.surfaceExploitation * 100
  ) // conversion 1 km² = 100 ha

  return statsInstant
}

const statistiquesGuyaneAnneeBuild = (
  titres: ITitre[],
  titresActivites: ITitreActivite[],
  annee: number
) => {
  // les titres créés dans l'année et leur surface lors de l'octroi
  const titresFiltered = titresArrayBuild(titres, annee)

  const {
    titresArm,
    titresPrm,
    titresAxm,
    titresPxm,
    titresCxm
  } = statistiquesGuyaneTitresGet(titresFiltered)

  // les activités de type grp de l'année
  const titresActivitesGrpFiltered = titresActivites.filter(
    ta => ta.annee === annee && ta.typeId === 'grp'
  )
  const statistiquesActivitesGrp = statistiquesGuyaneActivitesGet(
    titresActivitesGrpFiltered,
    {
      carburantConventionnel: 0,
      carburantDetaxe: 0,
      mercure: 0,
      environnement: 0,
      effectifs: 0,
      activitesDeposesQuantiteCount: 0,
      rapportProductionOrCount: 0
    }
  )
  // les activités de type gra de l'année
  const titresActivitesGraFiltered = titresActivites.filter(
    ta => ta.annee === annee && ta.typeId === 'gra'
  )
  const statistiquesActivitesGra = statistiquesGuyaneActivitesGet(
    titresActivitesGraFiltered,
    {
      orNet: 0,
      activitesDeposesQuantiteCount: 0,
      rapportProductionOrCount: 0
    }
  )

  const activitesDeposesRatio =
    statistiquesActivitesGrp.rapportProductionOrCount +
    statistiquesActivitesGra.rapportProductionOrCount
      ? Math.round(
          ((statistiquesActivitesGrp.activitesDeposesQuantiteCount +
            statistiquesActivitesGra.activitesDeposesQuantiteCount) *
            100) /
            (statistiquesActivitesGrp.rapportProductionOrCount +
              statistiquesActivitesGra.rapportProductionOrCount)
        )
      : 0

  return {
    annee,
    titresArm,
    titresPrm,
    titresAxm,
    titresPxm,
    titresCxm,
    orNet: Math.floor(statistiquesActivitesGra.orNet / 1000), // conversion 1000g = 1kg
    carburantConventionnel: Math.floor(
      statistiquesActivitesGrp.carburantConventionnel / 1000
    ), // milliers de litres
    carburantDetaxe: Math.floor(
      statistiquesActivitesGrp.carburantDetaxe / 1000
    ), // milliers de litres
    mercure: Math.floor(statistiquesActivitesGrp.mercure),
    environnementCout: Math.floor(statistiquesActivitesGrp.environnement),
    effectifs: Math.round(statistiquesActivitesGrp.effectifs / 4), // somme des effectifs sur 4 trimestre
    activitesDeposesQuantite:
      statistiquesActivitesGrp.activitesDeposesQuantiteCount +
      statistiquesActivitesGra.activitesDeposesQuantiteCount,
    activitesDeposesRatio
  }
}

const statistiquesGuyane = async () => {
  try {
    const anneeCurrent = new Date().getFullYear()
    // un tableau avec les 5 dernières années
    const annees = Array.from(Array(6).keys())
      .map(e => anneeCurrent - e)
      .reverse()

    const titres = await titresGet(
      {
        domainesIds: ['m'],
        typesIds: ['ar', 'pr', 'ax', 'px', 'cx'],
        territoires: 'guyane'
      },
      {
        fields: {
          surfaceEtape: { id: {} },
          demarches: { phase: { id: {} }, etapes: { id: {} } }
        }
      },
      'super'
    )

    const titresActivites = await titresActivitesGet(
      { titresTerritoires: 'guyane', annees, typesIds: ['grp', 'gra'] },
      {
        fields: {
          titre: { id: {} }
        }
      },
      'super'
    )

    return {
      annees: annees.map(annee =>
        statistiquesGuyaneAnneeBuild(titres, titresActivites, annee)
      ),
      ...statistiquesGuyaneInstantBuild(titres)
    }
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export { statistiquesGuyane }
