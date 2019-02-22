// classe les démarches selon la date de leur première étape
import titreEtapesAscSortByOrdre from './titre-etapes-asc-sort-by-ordre'

const titreDemarchesAscSort = titreDemarches =>
  titreDemarches.sort((a, b) => {
    // date identique -> todo
    // if (titreEtapesAscSort(a.etapes)[0].date - titreEtapesAscSort(b.etapes)[0].date === 0) {
    //   console.log(a.id, b.id)
    // }

    const dateA = titreEtapesAscSortByOrdre(a.etapes)[0].date
    const dateB = titreEtapesAscSortByOrdre(b.etapes)[0].date
    return dateA < dateB ? -1 : dateA > dateB ? 1 : a.ordre - b.ordre
  })

export default titreDemarchesAscSort
