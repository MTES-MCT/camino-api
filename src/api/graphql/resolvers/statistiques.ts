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

interface IGuyaneActivitesStats {
  orExtrait: number
  carburantConventionnel: number
  carburantDetaxe: number
  mercure: number
  environnement: number
  effectifs: number
  rapportProductionOrDeposesCount: number
  rapportProductionOrCount: number
}

const guyaneActivitesStatistiquesGet = (
  titresActivites: ITitreActivite[]
): IGuyaneActivitesStats =>
  titresActivites.reduce(
    (acc, ta) => {
      if (ta.typeId === 'grp') {
        acc.rapportProductionOrCount++
        if (ta.statutId === 'dep') acc.rapportProductionOrDeposesCount++
        ;(Object.keys(acc) as (keyof IGuyaneActivitesStats)[]).forEach(
          property => {
            if (
              ![
                'rapportProductionOrDeposesCount',
                'rapportProductionOrCount'
              ].includes(property) &&
              ta.contenu &&
              ta.contenu.renseignements &&
              ta.contenu.renseignements[property] &&
              (property !== 'effectifs' ||
                ta.titre!.typeId === 'axm' ||
                ta.titre!.typeId === 'pxm' ||
                ta.titre!.typeId === 'cxm')
            ) {
              const propertyValue = ta.contenu!.renseignements[property]
              acc[property] += Math.abs(Number(propertyValue))
            }
          }
        )
      }

      return acc
    },
    {
      orExtrait: 0,
      carburantConventionnel: 0,
      carburantDetaxe: 0,
      mercure: 0,
      environnement: 0,
      effectifs: 0,
      rapportProductionOrDeposesCount: 0,
      rapportProductionOrCount: 0
    }
  )

interface IGuyaneTitresStats {
  arm: number
  prm: number
  axm: number
  pxm: number
  cxm: number
  surfaceExploration: number
  surfaceExploitation: number
}

const guyaneTitresStatistiquesGet = (titres: ITitre[]): IGuyaneTitresStats =>
  titres.reduce(
    (acc, t) => {
      if (t.surfaceEtape && t.surfaceEtape.surface) {
        if (t.typeId === 'arm' || t.typeId === 'prm') {
          acc.surfaceExploration++
        } else {
          acc.surfaceExploitation++
        }
      }
      if (['arm', 'prm', 'axm', 'pxm', 'cxm'].includes(t.typeId)) {
        acc[t.typeId as keyof IGuyaneTitresStats]++
      }
      return acc
    },
    {
      arm: 0,
      prm: 0,
      axm: 0,
      pxm: 0,
      cxm: 0,
      surfaceExploration: 0,
      surfaceExploitation: 0
    }
  )

const statistiqueGuyaneBuild = (
  titres: ITitre[],
  titresActivites: ITitreActivite[],
  annee: number
) => {
  const titresStats: IGuyaneTitresStats = guyaneTitresStatistiquesGet(titres)
  const activitesStats: IGuyaneActivitesStats = guyaneActivitesStatistiquesGet(
    titresActivites
  )
  return {
    annee,
    titresMAr: titresStats.arm,
    titresMPr: titresStats.prm,
    titresMAx: titresStats.axm,
    titresMPx: titresStats.pxm,
    titresMCx: titresStats.cxm,
    surfaceExploration: Math.floor(titresStats.surfaceExploration * 100), // conversion 1 km² = 100 ha
    surfaceExploitation: Math.floor(titresStats.surfaceExploitation * 100), // conversion 1 km² = 100 ha
    productionOrNette: Math.floor(activitesStats.orExtrait / 1000), // conversion 1000g = 1kg
    carburantConventionnel: Math.floor(
      activitesStats.carburantConventionnel / 1000
    ), // milliers de litres
    carburantDetaxe: Math.floor(activitesStats.carburantDetaxe / 1000), // milliers de litres
    mercure: Math.floor(activitesStats.mercure),
    environnementCout: Math.floor(activitesStats.environnement),
    salaries: Math.round(activitesStats.effectifs / 4), // somme des effectifs sur 4 trimestre
    rapportProductionOrDeposes: activitesStats.rapportProductionOrDeposesCount,
    rapportProductionOrRatio: Math.round(
      (activitesStats.rapportProductionOrDeposesCount * 100) /
        activitesStats.rapportProductionOrCount
    )
  }
}

const statistiquesGuyane = async () => {
  try {
    const currentAnnee = new Date().getFullYear()
    // un tableau avec les 5 dernières années
    const anneesArray = Array.from(Array(6).keys())
      .map(e => currentAnnee - e)
      .reverse()

    //Valide ou modification en instance
    const titres = await titresGet(
      { statutsIds: ['val', 'mod'], territoires: 'guyane' },
      {
        fields: {
          type: { type: { id: {} } },
          surfaceEtape: { id: {} },
          activites: { id: {} }
        }
      },
      'super'
    )

    const { surfaceExploration, surfaceExploitation } = titres.reduce(
      (acc, titre) => {
        if (titre.surfaceEtape && titre.surfaceEtape.surface) {
          if (titre.typeId === 'arm' || titre.typeId === 'prm') {
            acc.surfaceExploration++
          } else {
            acc.surfaceExploitation++
          }
        }
        return acc
      },
      {
        surfaceExploration: 0,
        surfaceExploitation: 0
      }
    )

    const titresActivites = await titresActivitesGet(
      { titresTerritoires: 'guyane', annees: anneesArray, typesIds: ['grp'] },
      {
        fields: {
          titre: { id: {} }
        }
      },
      'super'
    )

    return {
      annees: anneesArray.map(annee => {
        //TODO filtrer les titres => titre octroyé cette année, quelle est l’année de la première phase valide
        const titresActivitesFiltered = titresActivites.filter(
          ta => ta.annee === annee
        )

        return statistiqueGuyaneBuild(titres, titresActivitesFiltered, annee)
      }),
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
