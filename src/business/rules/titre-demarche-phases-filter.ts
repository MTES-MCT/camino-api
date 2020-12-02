import { ITitreDemarche } from '../../types'

import titreEtapesSortAsc from '../utils/titre-etapes-sort-asc'
import titreEtapePublicationFilter from './titre-etape-publication-filter'

const demarchesTypesPhases = ['oct', 'pro', 'pr1', 'pr2', 'pre', 'vut', 'vct']

// si
// - la démarche est un octroi ou une prolongation ou une prolongation 1
// ou une prolongation 2 ou une prolongation exceptionnelle
// ou une demande de titre (démarche virtuelle)
// ou que la démarche fixe une date de fin ou une nouvelle durée
// - le statut de la démarche est acceptée
// - la démarche a une étape de publication
// - le statut de l'étape de publication est acceptée

const titreDemarchePhasesFilter = (
  titreDemarche: ITitreDemarche,
  titreTypeId?: string
) => {
  if (
    !demarchesTypesPhases.includes(titreDemarche.typeId) &&
    !titreDemarche.etapes!.find(e => e.dateFin || e.duree)
  ) {
    return false
  }

  if (titreDemarche.statutId !== 'acc') {
    return false
  }

  // on trie les étapes de façon ascendante pour le cas où
  // il existe une étape de publication et une étape rectificative,
  // on prend alors en compte l'originale
  const etapePublicationFirst = titreEtapesSortAsc(
    titreDemarche.etapes!
  ).find(etape => titreEtapePublicationFilter(etape.typeId, titreTypeId))

  return etapePublicationFirst
    ? ['acc', 'fai'].includes(etapePublicationFirst.statutId)
    : false
}

export default titreDemarchePhasesFilter
