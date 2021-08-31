import { ITitreDemarche } from '../../types'

import titreDemarchesSortAsc from '../utils/titre-elements-sort-asc'
import titreEtapesSortAsc from '../utils/titre-etapes-sort-asc'

const titreDateDemandeFind = (titreDemarches: ITitreDemarche[]) => {
  // trouve la démarche génératrice du titre
  // - première démarche d'octroi ou mutation partielle
  const titreDemarchesSorted = titreDemarchesSortAsc(
    titreDemarches
  ) as ITitreDemarche[]
  const titreDemarche = titreDemarchesSorted.find(titreDemarche =>
    ['oct', 'vut'].includes(titreDemarche.typeId)
  )

  // si
  // - il n'y a pas de démarche génératrice
  // - la démarche génératrice n'a pas d'étapes
  // alors retourne null
  if (!titreDemarche || !titreDemarche.etapes!.length) return null

  // dans la démarche génératrice, trouve
  // - la demande déposée
  // - ou l'enregistrement de la demande (pour les anciennes ARM)
  const titreEtapesSorted = titreEtapesSortAsc(titreDemarche.etapes!)
  const titreEtape = titreEtapesSorted.find(
    te => te.typeId === 'mdp' || te.typeId === 'men'
  )

  // si
  // - il n'y a pas d'étape de dépôt ou d'enregistrement de la demande
  // - l'étape n'a pas de date
  // alors retourne null
  if (!titreEtape || !titreEtape.date) return null

  // sinon
  // retourne la date de l'étape
  return titreEtape.date
}

export { titreDateDemandeFind }
