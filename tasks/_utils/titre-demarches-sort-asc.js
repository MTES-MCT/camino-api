// classe les démarches selon la date de leur première étape
const titreEtapesSortAsc = require('./titre-etapes-sort-asc')

const titreDemarchesSortAsc = titreDemarches =>
  titreDemarches.sort((a, b) => {
    // date identique -> todo
    // if (titreEtapesSortAsc(a)[0].date - titreEtapesSortAsc(b)[0].date === 0) {
    //   console.log(a.id, b.id)
    // }
    return titreEtapesSortAsc(a)[0].date - titreEtapesSortAsc(b)[0].date
  })

module.exports = titreDemarchesSortAsc
