import { titresGet } from '../../database/queries/titres'
import { titresActivitesGet } from '../../database/queries/titres-activites'
import { titreIsPublicTest } from './_restrictions'
const ACTIVITE_ANNEE_DEBUT = 2018

const statistiques = async () => {
  const titres = await titresGet({}, { eager: '', format: false })
  const titresTotal = titres.length

  const titresValide = titres.filter(titre => {
    const titreIsPublic = titreIsPublicTest(titre)

    return titreIsPublic ? titre : null
  }).length

  const titresActivites = await titresActivitesGet()

  const titresActivitesDepose = titresActivites.filter(
    titreActivite =>
      titreActivite.annee >= ACTIVITE_ANNEE_DEBUT &&
      titreActivite.activiteStatutId === 'dep'
  ).length

  const titresActivites2018Depose = titresActivites.filter(
    titreActivite =>
      titreActivite.annee === ACTIVITE_ANNEE_DEBUT &&
      titreActivite.activiteStatutId === 'dep'
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
}

export { statistiques }
