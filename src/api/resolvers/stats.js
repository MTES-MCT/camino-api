import { titresGet } from '../../database/queries/titres'
import { titresActivitesGet } from '../../database/queries/titres-activites'
import { restrictedDomaineIds, restrictedStatutIds } from './_restrictions'

const stats = async () => {
  const titres = await titresGet()
  const titresTotal = titres.length

  const titresValide = titres.filter(titre => {
    const titreIsPublicTest = (titreDomaineId, titreStatutId) =>
      !restrictedDomaineIds.includes(titreDomaineId) &&
      !restrictedStatutIds.includes(titreStatutId)

    const titreIsPublic = titreIsPublicTest(titre.domaineId, titre.statutId)

    if (titreIsPublic) return titre

    return null
  }).length

  const titresActivites = await titresActivitesGet()

  const titreActivite2018Total = titresActivites.filter(
    titreActivite => titreActivite.annee >= 2018
  ).length

  const titresActivites2018Depose = titresActivites.filter(
    titreActivite =>
      titreActivite.annee >= 2018 && titreActivite.activiteStatutId === 'dep'
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

export { stats }
