const sourcesImport = require('../_sources-import')
const seeding = require('../_seeding')

const data = sourcesImport([
  'permissions',
  'utilisateurs',
  'utilisateurs_entreprises',
  'utilisateurs_administrations'
])

exports.seed = seeding(async ({ del, insert }) => {
  await del('utilisateurs__administrations')
  await del('utilisateurs__entreprises')
  await del('utilisateurs')
  await del('permissions')

  await insert('permissions', data.permissions)
  await insert('utilisateurs', data.utilisateurs)
  await insert('utilisateurs__entreprises', data.utilisateurs_entreprises)
  await insert(
    'utilisateurs__administrations',
    data.utilisateurs_administrations
  )
})
