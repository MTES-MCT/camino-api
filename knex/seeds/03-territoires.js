const sourcesImport = require('../_sources-import')
const seeding = require('../_seeding')

const data = sourcesImport(['pays', 'regions', 'departements', 'communes'])

exports.seed = seeding(async ({ del, insert }) => {
  await del('communes')
  await del('departements')
  await del('regions')
  await del('pays')

  await insert('pays', data.pays)
  await insert('regions', data.regions)
  await insert('departements', data.departements)
  await insert('communes', data.communes)
})
