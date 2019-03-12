const titreValiditePeriodeCheck = (titre, periodeStart, periodeEnd) =>
  titre.demarches &&
  titre.demarches.some(
    ({ phase }) =>
      phase && periodeStart <= phase.dateFin && periodeEnd >= phase.dateDebut
  )

export default titreValiditePeriodeCheck
