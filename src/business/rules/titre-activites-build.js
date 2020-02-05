import * as dateFormat from 'dateformat'
import titreValiditePeriodeCheck from '../utils/titre-validite-periode-check'

const titreActiviteBuild = (
  { demarches: titreDemarches, statutId: titreStatutId, id: titreId },
  typeId,
  annee,
  periodeIndex,
  monthsCount
) => {
  const frequencePeriodeId = periodeIndex + 1

  const periodeDateFin = dateFormat(
    new Date(annee, (periodeIndex + 1) * monthsCount, 1),
    'yyyy-mm-dd'
  )

  // si la date de fin de l'activité n'est pas passée
  // on ne crée pas l'activité
  if (periodeDateFin > dateFormat(new Date(), 'yyyy-mm-dd')) return null

  // si le statut du titre n'est pas "modification en instance"
  // - vérifie les dates de validité
  if (titreStatutId !== 'mod') {
    const periodeDateDebut = dateFormat(
      new Date(annee, periodeIndex * monthsCount, 1),
      'yyyy-mm-dd'
    )

    // vérifie la validité du titre pour la période
    const titreIsValid = titreValiditePeriodeCheck(
      titreDemarches,
      periodeDateDebut,
      periodeDateFin
    )

    // le titre n'est pas valide pour cette période
    // on ne crée pas l'activité
    if (!titreIsValid) return null
  }

  const titreActivite = {
    titreId,
    // la date de début de l'activité est le premier jour du mois
    // du début de la période suivante, en fonction de la fréquence
    date: periodeDateFin,
    typeId,
    // le statut de l'activité crée automatiquement
    // est 'absente'
    statutId: 'abs',
    frequencePeriodeId,
    annee
  }

  return titreActivite
}

const titreActivitesBuild = (titre, activiteType, annees) => {
  const { frequence } = activiteType

  const periods = activiteType.frequence[frequence.periodesNom]
  const monthsCount = 12 / periods.length

  const { activites: titreActivites } = titre

  return annees.reduce(
    (acc, annee) =>
      periods.reduce((acc, e, periodeIndex) => {
        // cherche si l'activité existe déjà dans le titre
        let titreActivite =
          titreActivites &&
          titreActivites.find(
            a =>
              a.typeId === activiteType.id &&
              a.annee === annee &&
              a.frequencePeriodeId === periodeIndex + 1
          )

        // la ligne d'activité existe déjà pour le titre
        // il n'est pas nécessaire de la créer
        if (titreActivite) return acc

        titreActivite = titreActiviteBuild(
          titre,
          activiteType.id,
          annee,
          periodeIndex,
          monthsCount
        )

        if (titreActivite) {
          acc.push(titreActivite)
        }

        return acc
      }, acc),
    []
  )
}

export default titreActivitesBuild
