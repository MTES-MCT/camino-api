const sourcesImport = require('../_sources-import')
const seeding = require('../_seeding')

const data = sourcesImport([
  'substances',
  'substancesLegales',
  'substancesLegalesCodes',
  'substances_substancesLegales'
])

exports.seed = seeding(async ({ del, insert }) => {
  await del('substances')
  await del('substances__substancesLegales')
  await del('substancesLegales')
  await del('substancesLegalesCodes')

  await insert('substancesLegalesCodes', data.substancesLegalesCodes)
  await insert('substancesLegales', data.substancesLegales)
  await insert('substances', data.substances)
  await insert(
    'substances__substancesLegales',
    data.substances_substancesLegales
  )
})
