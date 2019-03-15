import titreValiditePeriodeCheck from '../utils/titre-validite-periode-check'

const titreActiviteCreateFromPeriod = (
  {
    activites: titreActivites,
    demarches: titreDemarches,
    statutId: titreStatutId,
    id: titreId
  },
  activiteTypeId,
  annee,
  periodIndex,
  monthsCount
) => {
  const frequencePeriodeId = periodIndex + 1

  // cherche si l'activité existe déjà dans le titre
  let titreActivite =
    titreActivites &&
    titreActivites.find(
      a =>
        a.activiteTypeId === activiteTypeId &&
        a.annee === annee &&
        a.frequencePeriodeId === frequencePeriodeId
    )

  // la ligne d'activité existe déjà pour le titre
  // il n'est pas nécessaire de la créer
  if (titreActivite) return null

  const nextPeriodeStart = new Date(annee, (periodIndex + 1) * monthsCount, 1)

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

  titreActivite = {
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

export default titreActiviteCreateFromPeriod
