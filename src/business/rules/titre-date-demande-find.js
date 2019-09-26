import * as dateFormat from 'dateformat'
import titreDemarchesAscSort from '../utils/titre-demarches-asc-sort'
import titreEtapesAscSort from '../utils/titre-etapes-asc-sort'

const titreDateDemandeFind = (titreDemarches, titreStatutId) => {
  // si
  // - le statut du titre n'est pas "Demande initiale"
  // retourne null
  if (titreStatutId !== 'dmi') return null

  // sinon
  // trouve la première démarche d'octroi
  const titreDemarchesAscSorted = titreDemarchesAscSort(titreDemarches)
  const titreDemarche = titreDemarchesAscSorted.find(titreDemarche =>
    ['oct', 'vut', 'vct'].includes(titreDemarche.typeId)
  )

  // si
  // - il n'y a pas de démarche d'octroi
  // - la démarche d'octroi n'a pas d'étapes
  // retourne null
  if (!titreDemarche || !titreDemarche.etapes.length) return null

  // trouve la première démarche de demande initiale
  const titreEtapeMen = titreEtapesAscSort(titreDemarche.etapes).find(
    te => te.typeId === 'men'
  )

  // si
  // - il n'y a pas d'étape de demande initiale
  // - l'étape de demande initiale n'a pas de date
  // retourne null
  if (!titreEtapeMen || !titreEtapeMen.date) return null

  // sinon
  // retourne la date de la demande initiale
  return dateFormat(titreEtapeMen.date, 'yyyy-mm-dd')
}

export default titreDateDemandeFind
