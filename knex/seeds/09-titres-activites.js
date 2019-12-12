const sourcesImport = require('../_sources-import')
const seeding = require('../_seeding')

const data = sourcesImport(['titresActivites'])

exports.seed = seeding(async ({ del, insert }) => {
  await del('titresActivites')

  await insert('titresActivites', data.titresActivites)
})
