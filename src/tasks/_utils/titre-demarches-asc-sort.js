// classe les démarches selon la date de leur première étape
const titreEtapesAscSort = require('./titre-etapes-asc-sort')

const titreDemarchesAscSort = titreDemarches =>
  titreDemarches.sort((a, b) => {
    // date identique -> todo
    // if (titreEtapesAscSort(a)[0].date - titreEtapesAscSort(b)[0].date === 0) {
    //   console.log(a.id, b.id)
    // }
    return titreEtapesAscSort(a)[0].date - titreEtapesAscSort(b)[0].date
  })

module.exports = titreDemarchesAscSort
