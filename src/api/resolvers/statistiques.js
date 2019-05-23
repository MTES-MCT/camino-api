import { titresGet } from '../../database/queries/titres'
import { titresActivitesGet } from '../../database/queries/titres-activites'
import { titreIsPublicTest } from './_restrictions'
const ACTIVITE_ANNEE_DEBUT = 2018

const statistiques = async () => {
  const titres = await titresGet()
  const titresTotal = titres.length

  const titresValide = titres.filter(titre => {
    const titreIsPublic = titreIsPublicTest(titre.domaineId, titre.statutId)

    return titreIsPublic ? titre : null
  }).length

  const titresActivites = await titresActivitesGet()

  const titreActivite2018Total = titresActivites.filter(
    titreActivite => titreActivite.annee >= ACTIVITE_ANNEE_DEBUT
  ).length

  const titresActivites2018Depose = titresActivites.filter(
    titreActivite =>
      titreActivite.annee >= ACTIVITE_ANNEE_DEBUT &&
      titreActivite.activiteStatutId === 'dep'
  ).length

  const titreActivites2018Ratio = Math.round(
    (titresActivites2018Depose / titreActivite2018Total) * 100
  )

  const titresActivites2018BeneficesEntreprise = Math.round(
    (titresActivites2018Depose * 2) / 7
  )

  const titresActivites2018BeneficesAdministration = Math.round(
    (titresActivites2018Depose * 1) / 7
  )

  return {
    titresTotal,
    titresValide,
    titresActivites2018Depose,
    titreActivites2018Ratio,
    titresActivites2018BeneficesEntreprise,
    titresActivites2018BeneficesAdministration
  }
}

export { statistiques }
