import { debug } from '../../config/index'
import { titresGet } from '../../database/queries/titres'
import { titresActivitesGet } from '../../database/queries/titres-activites'
import { titreIsPublicCheck } from './permissions/titre'
const ACTIVITE_ANNEE_DEBUT = 2018

const statistiques = async () => {
  try {
    const titres = await titresGet({}, { fields: {} }, 'super')
    const titresTotal = titres.length

    const titresValide = titres.filter(titre => {
      const titreIsPublic = titreIsPublicCheck(titre)

      return titreIsPublic ? titre : null
    }).length

    const titresActivites = await titresActivitesGet()

    const titresActivitesDepose = titresActivites.filter(
      titreActivite =>
        titreActivite.annee >= ACTIVITE_ANNEE_DEBUT &&
        titreActivite.statutId === 'dep'
    ).length

    const titresActivites2018Depose = titresActivites.filter(
      titreActivite =>
        titreActivite.annee === ACTIVITE_ANNEE_DEBUT &&
        titreActivite.statutId === 'dep'
    ).length

    const titreActivite2018Total = titresActivites.filter(
      titreActivite => titreActivite.annee === ACTIVITE_ANNEE_DEBUT
    ).length

    const titreActivites2018Ratio = Math.round(
      (titresActivites2018Depose / titreActivite2018Total) * 100
    )

    const titresActivitesBeneficesEntreprise = Math.round(
      (titresActivitesDepose * 2) / 7
    )

    const titresActivitesBeneficesAdministration = Math.round(
      (titresActivitesDepose * 1) / 7
    )

    return {
      titresTotal,
      titresValide,
      titresActivitesDepose,
      titreActivites2018Ratio,
      titresActivitesBeneficesEntreprise,
      titresActivitesBeneficesAdministration
    }
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export { statistiques }
