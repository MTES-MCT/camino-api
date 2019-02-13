// classe les démarches selon la date de leur première étape
import titreEtapesAscSort from './titre-etapes-asc-sort'

const titreDemarchesAscSort = titreDemarches =>
  titreDemarches.sort((a, b) => {
    // date identique -> todo
    // if (titreEtapesAscSort(a.etapes)[0].date - titreEtapesAscSort(b.etapes)[0].date === 0) {
    //   console.log(a.id, b.id)
    // }
    return (
      titreEtapesAscSort(a.etapes)[0].date -
      titreEtapesAscSort(b.etapes)[0].date
    )
  })

export default titreDemarchesAscSort
