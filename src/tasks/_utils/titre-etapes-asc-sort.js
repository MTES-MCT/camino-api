// classe les étapes selon leur ordre: 1, 2, 3, …
const titreEtapesAscSort = titreEtapes =>
  titreEtapes.sort((a, b) => a.ordre - b.ordre)

export default titreEtapesAscSort
