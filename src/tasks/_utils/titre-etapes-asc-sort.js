// classe les étapes selon leur ordre: 1, 2, 3, …
const titreEtapesAscSort = titreDemarche =>
  titreDemarche.etapes.sort((a, b) => a.ordre - b.ordre)

module.exports = titreEtapesAscSort
