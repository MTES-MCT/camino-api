import { ITitreDemarche } from '../../types'

import titreDemarchesSortAsc from '../utils/titre-elements-sort-asc'
import titreEtapesSortAsc from '../utils/titre-etapes-sort-asc'

const titreDateDemandeFind = (
  titreDemarches: ITitreDemarche[],
  titreStatutId: string
) => {
  // si
  // - le statut du titre n'est ni "demande initiale", ni "demande classée"
  // alors retourne null
  if (!['dmi', 'dmc'].includes(titreStatutId)) return null

  // sinon
  // trouve la première démarche d'octroi
  const titreDemarchesSorted = titreDemarchesSortAsc(
    titreDemarches
  ) as ITitreDemarche[]
  const titreDemarche = titreDemarchesSorted.find(titreDemarche =>
    ['oct', 'vut', 'vct'].includes(titreDemarche.typeId)
  )

  // si
  // - il n'y a pas de démarche d'octroi
  // - la démarche d'octroi n'a pas d'étapes
  // alors retourne null
  if (!titreDemarche || !titreDemarche.etapes!.length) return null

  // trouve la première étape de dépôt ou d'enregistrement de la demande
  const titreEtapesSorted = titreEtapesSortAsc(titreDemarche.etapes!)
  const titreEtapeMen = titreEtapesSorted.find(te =>
    ['mdp', 'men'].includes(te.typeId)
  )

  // si
  // - il n'y a pas d'étape de dépôt ou d'enregistrement de la demande
  // - l'étape n'a pas de date
  // alors retourne null
  if (!titreEtapeMen || !titreEtapeMen.date) return null

  // sinon
  // retourne la date de l'étape
  return titreEtapeMen.date
}

export default titreDateDemandeFind
