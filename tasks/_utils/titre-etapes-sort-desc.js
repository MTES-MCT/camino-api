// classe les étapes selon leur ordre inverse: 3, 2, 1.
const titreEtapesSortDesc = td => td.etapes.sort((a, b) => a.ordre < b.ordre)

module.exports = titreEtapesSortDesc
