const titreValiditePeriodeCheck = (titreDemarches, dateDebut, dateFin) =>
  titreDemarches &&
  titreDemarches.some(
    ({ phase }) =>
      phase && dateDebut <= phase.dateFin && dateFin >= phase.dateDebut
  )

export default titreValiditePeriodeCheck
