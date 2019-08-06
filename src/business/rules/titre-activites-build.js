import titreValiditePeriodeCheck from '../utils/titre-validite-periode-check'

const titreActiviteBuild = (
  { demarches: titreDemarches, statutId: titreStatutId, id: titreId },
  activiteTypeId,
  annee,
  periodIndex,
  monthsCount
) => {
  const frequencePeriodeId = periodIndex + 1

  const nextPeriodeStart = new Date(annee, (periodIndex + 1) * monthsCount, 1)

  // si la date de début de la période suivante est dans le futur
  // on ne crée pas l'activité
  if (nextPeriodeStart > new Date()) return null

  // on ne vérifie les dates de validité que
  // si le statut du titre n'est pas "modification en instance"
  if (titreStatutId !== 'mod') {
    const periodeStart = new Date(annee, periodIndex * monthsCount, 1)

    // vérifie la validité du titre pour la période
    const valid = titreValiditePeriodeCheck(
      titreDemarches,
      periodeStart,
      nextPeriodeStart
    )

    // le titre n'est pas valide pour cette période
    // on ne crée pas l'activité
    if (!valid) return null
  }

  const titreActivite = {
    titreId,
    // la date de début de l'activité est le premier jour du mois
    // du début de la période suivante, en fonction de la fréquence
    date: nextPeriodeStart,
    activiteTypeId,
    // le statut de l'activité crée automatiquement
    // est 'absente'
    activiteStatutId: 'abs',
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
      periods.reduce((acc, e, periodIndex) => {
        // cherche si l'activité existe déjà dans le titre
        let titreActivite =
          titreActivites &&
          titreActivites.find(
            a =>
              a.activiteTypeId === activiteType.id &&
              a.annee === annee &&
              a.frequencePeriodeId === periodIndex + 1
          )

        // la ligne d'activité existe déjà pour le titre
        // il n'est pas nécessaire de la créer
        if (titreActivite) return acc

        titreActivite = titreActiviteBuild(
          titre,
          activiteType.id,
          annee,
          periodIndex,
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
