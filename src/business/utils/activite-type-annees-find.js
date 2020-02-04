const activiteTypeAnneesFind = activiteType => {
  // calcule les années qui concernent le type d'activité
  const anneeDebut = new Date(activiteType.dateDebut).getFullYear()
  const anneeFin = new Date().getFullYear()

  const annees = []

  for (let annee = anneeDebut; annee <= anneeFin; annee += 1) {
    annees.push(annee)
  }

  return annees
}

export default activiteTypeAnneesFind
