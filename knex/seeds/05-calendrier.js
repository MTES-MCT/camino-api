const sourcesImport = require('../_sources-import')
const seeding = require('../_seeding')

const data = sourcesImport(['frequences', 'annees', 'trimestres', 'mois'])

exports.seed = seeding(async ({ del, insert }) => {
  await del('mois')
  await del('trimestres')
  await del('frequences')

  await insert('frequences', data.frequences)
  await insert('annees', data.annees)
  await insert('trimestres', data.trimestres)
  await insert('mois', data.mois)
})
