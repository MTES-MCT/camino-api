// classe les démarches selon la date de leur première étape
// puis par ordre si les dates sont identiques
import titreEtapesAscSortByOrdre from './titre-etapes-asc-sort'

const titreDemarchesAscSort = titreDemarches =>
  titreDemarches.sort((a, b) => {
    const dateA = titreEtapesAscSortByOrdre(a.etapes)[0].date
    const dateB = titreEtapesAscSortByOrdre(b.etapes)[0].date
    return dateA < dateB ? -1 : dateA > dateB ? 1 : a.ordre - b.ordre
  })

export default titreDemarchesAscSort
