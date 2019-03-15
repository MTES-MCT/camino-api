const titreValiditePeriodeCheck = (titreDemarches, periodeStart, periodeEnd) =>
  titreDemarches &&
  titreDemarches.some(
    ({ phase }) =>
      phase && periodeStart <= phase.dateFin && periodeEnd >= phase.dateDebut
  )

export default titreValiditePeriodeCheck
