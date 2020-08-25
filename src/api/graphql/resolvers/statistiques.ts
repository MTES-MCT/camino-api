import { debug } from '../../../config/index'
import { titresActivitesGet } from '../../../database/queries/titres-activites'
import { matomoData } from '../../../tools/api-matomo/index'

const ACTIVITE_ANNEE_DEBUT = 2018

const statistiques = async () => {
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
      nbSearchArray,
      nbMajTitresArray,
      nbAction,
      timeSession,
      nbDonwload
    } = await matomoData()

    return {
      titresActivitesBeneficesEntreprise,
      titresActivitesBeneficesAdministration,
      nbSearchArray,
      nbMajTitresArray,
      nbAction,
      timeSession,
      nbDonwload
    }
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export { statistiques }
