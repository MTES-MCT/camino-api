const sourcesImport = require('../_sources-import')
const seeding = require('../_seeding')

const data = sourcesImport([
  'activitesStatuts',
  'activitesTypes',
  'activitesTypes_types',
  'activitesTypes_pays'
])

exports.seed = seeding(async ({ del, insert }) => {
  await del('activitesTypes__pays')
  await del('activitesTypes__types')
  await del('activitesTypes')
  await del('activitesStatuts')

  await insert('activitesStatuts', data.activitesStatuts)
  await insert('activitesTypes', data.activitesTypes)
  await insert('activitesTypes__types', data.activitesTypes_types)
  await insert('activitesTypes__pays', data.activitesTypes_pays)
})
