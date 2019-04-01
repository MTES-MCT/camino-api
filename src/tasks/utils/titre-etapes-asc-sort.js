// classe les étapes selon leur ordre: 1, 2, 3, …
const titreEtapesAscSortByOrdre = titreEtapes =>
  titreEtapes.sort((a, b) => a.ordre - b.ordre)

export default titreEtapesAscSortByOrdre
