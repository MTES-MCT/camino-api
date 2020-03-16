import { IActiviteType } from '../../types'

const activiteTypeAnneesFind = (activiteType: IActiviteType) => {
  // calcule les années qui concernent le type d'activité
  const anneeDebut = new Date(activiteType.dateDebut).getFullYear()
  const anneeFin = new Date().getFullYear()

  const annees = [...new Array(anneeFin - anneeDebut + 1)].map(
    (x, delta) => anneeDebut + delta
  )

  return annees
}

export default activiteTypeAnneesFind
