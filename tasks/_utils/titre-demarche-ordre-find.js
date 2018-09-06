const titreEtapesSortAsc = require('./titre-etapes-sort-desc')

// retourne les démarches appartenant au même titre
const titreDemarchesFind = (titresDemarches, titreId) =>
  titresDemarches.filter(titreDemarche => titreDemarche.titreId === titreId)

// classe les démarches selon la date de leur première étape
const titreDemarchesSortAsc = titreDemarches =>
  titreDemarches.sort((a, b) => {
    // date identique -> demander à Guillaume
    // if (titreEtapesSortAsc(a)[0].date - titreEtapesSortAsc(b)[0].date === 0) {
    //   console.log(a.id, b.id)
    // }
    return titreEtapesSortAsc(a)[0].date - titreEtapesSortAsc(b)[0].date
  })

// retourne une closure qui teste l'id d'une démarche
const titreDemarcheIdTest = titreDemarcheId => titreDemarche =>
  titreDemarche.id === titreDemarcheId

// retourne l'ordre (index + 1) d'une démarche
const titreDemarcheOrdreFind = (titreDemarche, titresDemarches) => {
  // démarches appartenant au même titre
  const titreDemarches = titreDemarchesFind(
    titresDemarches,
    titreDemarche.titreId
  )

  // démarches classées selon la date de leur première étape
  const titreDemarchesSorted = titreDemarchesSortAsc(titreDemarches)

  // index de la démarche parmi les démarches classées
  const titreDemarcheIndex = titreDemarchesSorted.findIndex(
    titreDemarcheIdTest(titreDemarche.id)
  )

  return titreDemarcheIndex !== -1 ? titreDemarcheIndex + 1 : 0
}

module.exports = titreDemarcheOrdreFind
