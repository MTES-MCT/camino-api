import camelcase from 'camelcase'

import { ITitre, ITitreActivite } from '../../../types'

import { debug } from '../../../config/index'
import { titresGet } from '../../../database/queries/titres'
import { titresActivitesGet } from '../../../database/queries/titres-activites'
import { userSuper } from '../../../database/user-super'
import { titresSurfaceIndexBuild } from './statistiques'

const statistiquesGuyaneActivitesBuild = (
  sectionId: string,
  titresActivites: ITitreActivite[],
  init: { [key: string]: number }
) =>
  titresActivites.reduce((acc: { [key: string]: number }, ta) => {
    acc.rapportProductionOrCount++

    if (ta.statutId === 'dep') {
      acc.activitesDeposesQuantiteCount++
    }

    Object.keys(acc).forEach(prop => {
      if (
        ta.contenu &&
        ta.contenu[sectionId] &&
        ta.contenu[sectionId][prop] &&
        (prop !== 'effectifs' ||
          ta.titre!.typeId === 'axm' ||
          ta.titre!.typeId === 'pxm' ||
          ta.titre!.typeId === 'cxm')
      ) {
        const value = ta.contenu![sectionId][prop]

        acc[prop] += Number(value)
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

const statistiquesGuyaneTitresBuild = (
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
  const titresFiltered = titresSurfaceIndexBuild(titres, annee)

  const { titresArm, titresPrm, titresAxm, titresPxm, titresCxm } =
    statistiquesGuyaneTitresBuild(titresFiltered)

  // les activités de type grp de l'année
  const titresActivitesGrpFiltered = titresActivites.filter(
    ta => ta.annee === annee && ta.typeId === 'grp'
  )
  const statistiquesActivitesGrp = statistiquesGuyaneActivitesBuild(
    'renseignements',
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
  // les activités de type gra et grx de l'année
  const titresActivitesGraFiltered = titresActivites.filter(
    ta => ta.annee === annee && (ta.typeId === 'gra' || ta.typeId === 'grx')
  )
  const statistiquesActivitesGra = statistiquesGuyaneActivitesBuild(
    'substancesFiscales',
    titresActivitesGraFiltered,
    {
      auru: 0,
      activitesDeposesQuantiteCount: 0,
      rapportProductionOrCount: 0
    }
  )

  // Pour les années 2017 et 2018, on affiche les chiffres "DRFIP" soit : pour 2017 : 1 485 kg  et pour 2018 : 1320 kg.
  if (annee === 2017) {
    // les rapports annuels n'existaient pas en 2017
    statistiquesActivitesGra.auru = 1485
  } else if (annee === 2018) {
    // à l'époque  l'or net annuel était déclaré "à coté" de la production d'or brut du 4ème trimestre, ce qui a provoqué la confusion des opérateurs et des erreurs en cascade.
    statistiquesActivitesGra.auru = 1320
  }

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
    orNet: Math.floor(statistiquesActivitesGra.auru),
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
          demarches: { phase: { id: {} }, etapes: { id: {} }, type: { id: {} } }
        }
      },
      userSuper
    )

    const titresActivites = await titresActivitesGet(
      { titresTerritoires: 'guyane', annees, typesIds: ['grp', 'gra', 'grx'] },
      { fields: { titre: { id: {} } } },
      userSuper
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
