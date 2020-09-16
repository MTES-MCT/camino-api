import * as camelcase from 'camelcase'
import titreEtapePropFind from '../../../business/rules/titre-etape-prop-find'
import { debug } from '../../../config/index'
import { titresGet } from '../../../database/queries/titres'
import { titresActivitesGet } from '../../../database/queries/titres-activites'
import { matomoData } from '../../../tools/api-matomo/index'
import { ITitre, ITitreActivite } from '../../../types'

const ACTIVITE_ANNEE_DEBUT = 2018

const statistiquesGlobales = async () => {
  try {
    const titresActivites = await titresActivitesGet({}, {}, 'super')

    const titresActivitesDepose = titresActivites.filter(
      titreActivite =>
        titreActivite.annee >= ACTIVITE_ANNEE_DEBUT &&
        titreActivite.statutId === 'dep'
    ).length

    const titresActivitesBeneficesEntreprise = Math.round(
      (titresActivitesDepose * 2) / 7
    )

    const titresActivitesBeneficesAdministration = Math.round(
      (titresActivitesDepose * 1) / 7
    )

    const {
      recherches,
      titresModifies,
      actions,
      sessionDuree,
      telechargements,
      signalements,
      reutilisations
    } = await matomoData()

    const demarches = titresActivites.filter(titreActivite => {
      const dateSaisie = titreActivite.dateSaisie

      return (
        dateSaisie &&
        dateSaisie.slice(0, 4) === new Date().getFullYear().toString()
      )
    }).length

    return {
      titresActivitesBeneficesEntreprise,
      titresActivitesBeneficesAdministration,
      recherches,
      titresModifies,
      actions,
      sessionDuree,
      telechargements,
      demarches,
      signalements,
      reutilisations
    }
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const statistiquesGuyaneActivitesGet = (
  titresActivites: ITitreActivite[],
  init: { [key: string]: number }
) =>
  titresActivites.reduce((acc: { [key: string]: number }, ta) => {
    acc.rapportProductionOrCount++
    if (ta.statutId === 'dep') acc.rapportProductionOrDeposesCount++
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
  titres: { id: string; typeId: IStatsGuyaneTitresTypes; surface: number }[]
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

const statsSurfacesBuild = (titres: ITitre[]) =>
  titres.reduce(
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
      }

      return acc
    },
    {
      surfaceExploration: 0,
      surfaceExploitation: 0
    }
  )

const titreIndexBuild = (titres: ITitre[], annee: number) =>
  titres.reduce(
    (
      acc: {
        id: string
        typeId: IStatsGuyaneTitresTypes
        surface: number
      }[],
      titre
    ) => {
      // filtre les titres dont le premier octroi avec une phase valide
      // débute cette année
      const firstOctroiValide = titre.demarches?.find(
        demarche =>
          demarche.typeId === 'oct' &&
          demarche.phase &&
          demarche.phase.statutId === 'val' &&
          demarche.phase.dateDebut &&
          demarche.phase.dateDebut.substr(0, 4) === annee.toString()
      )

      if (!firstOctroiValide?.etapes?.length) return acc

      const surface = titreEtapePropFind(
        'surface',
        firstOctroiValide.etapes[0],
        firstOctroiValide.etapes,
        titre
      ) as number | null | undefined

      acc.push({
        id: titre.id,
        typeId: titre.typeId as IStatsGuyaneTitresTypes,
        surface: surface ? surface * 100 : 0 // conversion 1 km² = 100 ha
      })

      return acc
    },
    []
  )

const anneeStatsBuild = (
  titres: ITitre[],
  titresActivites: ITitreActivite[],
  annee: number
) => {
  // les titres créés dans l'année et leur surface lors de l'octroi
  const titresFiltered = titreIndexBuild(titres, annee)

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
  const statsActivitesGrp = statistiquesGuyaneActivitesGet(
    titresActivitesGrpFiltered,
    {
      carburantConventionnel: 0,
      carburantDetaxe: 0,
      mercure: 0,
      environnement: 0,
      effectifs: 0,
      rapportProductionOrDeposesCount: 0,
      rapportProductionOrCount: 0
    }
  )
  // les activités de type gra de l'année
  const titresActivitesGraFiltered = titresActivites.filter(
    ta => ta.annee === annee && ta.typeId === 'grp'
  )
  const statsActivitesGra = statistiquesGuyaneActivitesGet(
    titresActivitesGraFiltered,
    {
      orNet: 0,
      rapportProductionOrDeposesCount: 0,
      rapportProductionOrCount: 0
    }
  )

  const rapportProductionOrRatio =
    statsActivitesGrp.rapportProductionOrCount +
    statsActivitesGra.rapportProductionOrCount
      ? Math.round(
          ((statsActivitesGrp.rapportProductionOrDeposesCount +
            statsActivitesGra.rapportProductionOrDeposesCount) *
            100) /
            (statsActivitesGrp.rapportProductionOrCount +
              statsActivitesGra.rapportProductionOrCount)
        )
      : 0

  return {
    annee,
    titresArm,
    titresPrm,
    titresAxm,
    titresPxm,
    titresCxm,
    orNet: Math.floor(statsActivitesGra.orNet / 1000), // conversion 1000g = 1kg
    carburantConventionnel: Math.floor(
      statsActivitesGrp.carburantConventionnel / 1000
    ), // milliers de litres
    carburantDetaxe: Math.floor(statsActivitesGrp.carburantDetaxe / 1000), // milliers de litres
    mercure: Math.floor(statsActivitesGrp.mercure),
    environnementCout: Math.floor(statsActivitesGrp.environnement),
    salaries: Math.round(statsActivitesGrp.effectifs / 4), // somme des effectifs sur 4 trimestre
    rapportProductionOrDeposes:
      statsActivitesGrp.rapportProductionOrDeposesCount,
    rapportProductionOrRatio
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

    const { surfaceExploration, surfaceExploitation } = statsSurfacesBuild(
      titres
    )

    return {
      annees: annees.map(annee =>
        anneeStatsBuild(titres, titresActivites, annee)
      ),
      surfaceExploration: Math.floor(surfaceExploration * 100), // conversion 1 km² = 100 ha
      surfaceExploitation: Math.floor(surfaceExploitation * 100) // conversion 1 km² = 100 ha
    }
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export { statistiquesGlobales, statistiquesGuyane }
