// classe les étapes selon leur ordre: 1, 2, 3, …
const titreEtapesSortAsc = titreDemarche =>
  titreDemarche.etapes.sort((a, b) => a.ordre - b.ordre)

module.exports = titreEtapesSortAsc
