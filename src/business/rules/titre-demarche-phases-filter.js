import titreEtapesAscSort from '../utils/titre-etapes-asc-sort'
import titreEtapePublicationFilter from './titre-etape-publication-filter'

const demarchesTypesPhases = ['oct', 'pro', 'pr1', 'pr2', 'pre', 'vut', 'vct']

// si
// - la démarche est un octroi ou une prolongation ou une prolongation 1
// ou une prolongation 2 ou une prolongation exceptionnelle
// - le statut de la démarche est acceptée
// - la démarche a une étape de publication
// - le statut de l'étape de publication est acceptée

const titreDemarchePhasesFilter = (titreDemarche, titreTypeId) => {
  if (!demarchesTypesPhases.includes(titreDemarche.typeId)) {
    return false
  }

  if (titreDemarche.statutId !== 'acc') {
    return false
  }

  // on trie les étapes de façon ascendante pour le cas où
  // il existe une étape de publication et une étape rectificative,
  // on prend alors en compte l'originale
  const etapePublicationFirst = titreEtapesAscSort(
    titreDemarche.etapes.slice()
  ).find(etape => titreEtapePublicationFilter(etape, titreTypeId))

  return etapePublicationFirst
    ? etapePublicationFirst.statutId === 'acc'
    : false
}

export default titreDemarchePhasesFilter
