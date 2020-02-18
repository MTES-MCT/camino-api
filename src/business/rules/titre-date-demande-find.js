import titreDemarchesAscSort from '../utils/titre-demarches-asc-sort'
import titreEtapesAscSort from '../utils/titre-etapes-asc-sort'

const titreDateDemandeFind = (titreDemarches, titreStatutId) => {
  // si
  // - le statut du titre n'est ni "demande initiale", ni "demande classée"
  // alors retourne null
  if (!['dmi', 'dmc'].includes(titreStatutId)) return undefined

  // sinon
  // trouve la première démarche d'octroi
  const titreDemarchesAscSorted = titreDemarchesAscSort(titreDemarches)
  const titreDemarche = titreDemarchesAscSorted.find(titreDemarche =>
    ['oct', 'vut', 'vct'].includes(titreDemarche.typeId)
  )

  // si
  // - il n'y a pas de démarche d'octroi
  // - la démarche d'octroi n'a pas d'étapes
  // alors retourne null
  if (!titreDemarche || !titreDemarche.etapes.length) return undefined

  // trouve la première étape de dépôt ou d'enregistrement de la demande
  const titreEtapesAscSorted = titreEtapesAscSort(titreDemarche.etapes)
  const titreEtapeMen = titreEtapesAscSorted.find(te =>
    ['mdp', 'men'].includes(te.typeId)
  )

  // si
  // - il n'y a pas d'étape de dépôt ou d'enregistrement de la demande
  // - l'étape n'a pas de date
  // alors retourne null
  if (!titreEtapeMen || !titreEtapeMen.date) return undefined

  // sinon
  // retourne la date de l'étape
  return titreEtapeMen.date
}

export default titreDateDemandeFind
