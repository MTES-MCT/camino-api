// classe les étapes selon leur ordre inverse: 3, 2, 1.
const titreEtapesSortDesc = titreEtapes =>
  titreEtapes.sort((a, b) => b.ordre - a.ordre)

export default titreEtapesSortDesc
