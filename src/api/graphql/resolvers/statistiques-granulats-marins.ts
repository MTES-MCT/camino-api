import * as camelcase from 'camelcase'
import { debug } from '../../../config/index'
import { titresGet } from '../../../database/queries/titres'
import { titresActivitesGet } from '../../../database/queries/titres-activites'
import { ITitre, ITitreActivite } from '../../../types'
import { titresArrayBuild } from './statistiques'

const statistiquesGranulatsMarinsActivitesGet = (
  titresActivites: ITitreActivite[],
  init: { [key: string]: number }
) =>
  titresActivites.reduce((acc: { [key: string]: number }, ta) => {
    acc.rapportProductionCount++
    if (ta.statutId === 'dep') acc.activitesDeposesQuantiteCount++
    Object.keys(acc).forEach(prop => {
      if (
        ta.contenu &&
        ta.contenu.renseignementsProduction &&
        ta.contenu.renseignementsProduction[prop]
      ) {
        const value = ta.contenu!.renseignementsProduction[prop]
        acc[prop] += Math.abs(Number(value))
      }
    })

    return acc
  }, init)

type IStatsGranulatsMarinsTitresTypesHistorique =
  | 'titresPrw'
  | 'titresPxw'
  | 'titresCxw'

type IStatsGranulatsMarinsTitresTypesInstant =
  | 'titresInstructionPrw'
  | 'titresValPrw'
  | 'titresDmiCxw'
  | 'titresValCxw'

const statistiquesGranulatsMarinsTitresGet = (
  titres: { id: string; typeId: string; surface: number }[]
) =>
  titres.reduce(
    (acc, titre) => {
      const id = camelcase(
        `titres-${titre.typeId}`
      ) as IStatsGranulatsMarinsTitresTypesHistorique

      acc[id].quantite++
      acc[id].surface += titre.surface

      return acc
    },
    {
      titresPrw: { quantite: 0, surface: 0 },
      titresPxw: { quantite: 0, surface: 0 },
      titresCxw: { quantite: 0, surface: 0 }
    }
  )

const statistiquesGranulatsMarinsInstantBuild = (titres: ITitre[]) => {
  const statsInstant = titres.reduce(
    (acc, titre) => {
      if (
        titre.statutId &&
        ['val', 'mod', 'dmi'].includes(titre.statutId) &&
        titre.surfaceEtape &&
        titre.surfaceEtape.surface
      ) {
        if (titre.typeId! === 'prw') {
          acc.surfaceExploration += titre.surfaceEtape.surface
        } else {
          acc.surfaceExploitation += titre.surfaceEtape.surface
        }
        const id = camelcase(
          `titres-${titre.statutId!}-${titre.typeId!}`
        ) as IStatsGranulatsMarinsTitresTypesInstant

        acc[id]++

        if (
          titre.typeId! === 'prw' &&
          ['mod', 'dmi'].includes(titre.statutId!)
        ) {
          acc.titresInstructionPrw++
        }
      }

      return acc
    },
    {
      surfaceExploration: 0,
      surfaceExploitation: 0,
      titresInstructionPrw: 0,
      titresValPrw: 0,
      titresDmiCxw: 0,
      titresValCxw: 0
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

const statistiquesGranulatsMarinsAnneeBuild = (
  titres: ITitre[],
  titresActivites: ITitreActivite[],
  annee: number
) => {
  // les titres créés dans l'année et leur surface lors de l'octroi
  const titresFiltered = titresArrayBuild(titres, annee)

  const {
    titresPrw,
    titresPxw,
    titresCxw
  } = statistiquesGranulatsMarinsTitresGet(titresFiltered)

  // les activités de l'année
  const titresActivitesAnneeFiltered = titresActivites.filter(
    ta => ta.annee === annee
  )
  const statistiquesActivites = statistiquesGranulatsMarinsActivitesGet(
    titresActivitesAnneeFiltered,
    {
      volumeGranulatsExtrait: 0,
      masseGranulatsExtrait: 0,
      activitesDeposesQuantiteCount: 0,
      rapportProductionCount: 0
    }
  )

  const activitesDeposesRatio = statistiquesActivites.rapportProductionCount
    ? Math.round(
        (statistiquesActivites.activitesDeposesQuantiteCount * 100) /
          statistiquesActivites.rapportProductionCount
      )
    : 0

  return {
    annee,
    titresPrw,
    titresPxw,
    titresCxw,
    granulatsExtrait: {
      volumeGranulatsExtrait: Math.floor(
        statistiquesActivites.volumeGranulatsExtrait
      ),
      // ne pas indiquer un tonnage produit nul ou incohérent par rapport au volume produit.
      // Si l'on ne dispose pas de la donnée tonnage (pour les années antérieures à 2019), appliquer la règle de trois suivante : 1m3 => 1,53 tonne.
      masseGranulatsExtrait:
        annee < 2019
          ? Math.floor(statistiquesActivites.volumeGranulatsExtrait * 1.53)
          : Math.floor(statistiquesActivites.masseGranulatsExtrait)
    },
    activitesDeposesQuantite:
      statistiquesActivites.activitesDeposesQuantiteCount,
    activitesDeposesRatio
  }
}

const statistiquesGranulatsMarins = async () => {
  try {
    const anneeCurrent = new Date().getFullYear()
    // un tableau avec les années depuis 2006
    const annees = Array.from(Array(anneeCurrent - 2006 + 1).keys())
      .map(e => anneeCurrent - e)
      .reverse()

    const titres = await titresGet(
      {
        domainesIds: ['w'],
        typesIds: ['pr', 'ax', 'px', 'cx']
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
      { annees, typesIds: ['wrp'] },
      {
        fields: {
          titre: { id: {} }
        }
      },
      'super'
    )

    return {
      annees: annees.map(annee =>
        statistiquesGranulatsMarinsAnneeBuild(titres, titresActivites, annee)
      ),
      ...statistiquesGranulatsMarinsInstantBuild(titres)
    }
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export { statistiquesGranulatsMarins }
