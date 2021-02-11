/**
 * Retourne une liste d'années
 * @param dateDebut - date de début au format 'yyy-mm-dd'
 * @param dateFin - date de fin au format 'yyy-mm-dd'
 */
const anneesBuild = (dateDebut: string, dateFin: string) => {
  const anneeDebut = new Date(dateDebut).getFullYear()
  const anneeFin = new Date(dateFin).getFullYear()

  if (anneeFin < anneeDebut) return []

  const annees = [...new Array(anneeFin - anneeDebut + 1)].map(
    (_, delta) => anneeDebut + delta
  )

  return annees
}

export { anneesBuild }
