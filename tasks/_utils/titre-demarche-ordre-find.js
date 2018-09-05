const titreEtapesSortAsc = require('./titre-etapes-sort-desc')

// classe les démarches selon l'ordre de leur première étape
const titreDemarchesSortDesc = titreDemarches =>
  titreDemarches.sort(
    (a, b) => titreEtapesSortAsc(a)[0].date > titreEtapesSortAsc(b)[0].date
  )

// retourne les démarches appartenant au même titre
const titreDemarchesFind = (titreDemarche, titresDemarches) =>
  titresDemarches.filter(td => td.titreId === titreDemarche.titreId)

// retourne une fonction test sur l'id d'une démarche
const titreDemarcheIdTest = titreDemarcheId => titreDemarche =>
  titreDemarche.id === titreDemarcheId

// combinaison des trois fonctions ci-dessus:
// retourne l'ordre (index + 1) d'une démarche
// parmi les autres démarches appartenant au même titre
// classées selon l'ordre de leur première étape
const titreDemarcheOrdreFind = (titreDemarche, titresDemarches) =>
  titreDemarchesSortDesc(
    titreDemarchesFind(titreDemarche, titresDemarches)
  ).findIndex(titreDemarcheIdTest(titreDemarche.id)) + 1

module.exports = titreDemarcheOrdreFind
