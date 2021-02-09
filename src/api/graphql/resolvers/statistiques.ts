import { titreEtapePropFind } from '../../../business/rules/titre-etape-prop-find'
import { debug } from '../../../config/index'

import { titresActivitesGet } from '../../../database/queries/titres-activites'
import { matomoData } from '../../../tools/api-matomo/index'
import { ITitre } from '../../../types'

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

/**
 * titres créés dans l'année et leur surface lors de l'octroi
 * @param titres -
 * @param annee
 */

const titresSurfaceIndexBuild = (titres: ITitre[], annee: number) =>
  titres.reduce(
    (
      acc: {
        id: string
        typeId: string
        surface: number
      }[],
      titre
    ) => {
      // titres dont le dernier octroi valide avec une phase valide débute cette année
      const titreDemarcheOctroiValide = titre.demarches?.find(
        demarche =>
          demarche.typeId === 'oct' &&
          demarche.phase &&
          demarche.phase.dateDebut &&
          demarche.phase.dateDebut.substr(0, 4) === annee.toString()
      )

      if (!titreDemarcheOctroiValide) return acc

      const surface = titreEtapePropFind(
        'surface',
        titreDemarcheOctroiValide.phase!.dateDebut,
        [titreDemarcheOctroiValide],
        titre.typeId
      ) as number | null

      acc.push({
        id: titre.id,
        typeId: titre.typeId,
        surface: surface ? surface * 100 : 0 // conversion 1 km² = 100 ha
      })

      return acc
    },
    []
  )

export { statistiquesGlobales, titresSurfaceIndexBuild }
