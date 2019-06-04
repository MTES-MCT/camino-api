const seeding = require('../seeding')

const utilisateurs = require('../../sources/utilisateurs.json')
const permissions = require('../../sources/permissions.json')

exports.seed = seeding(async ({ del, insert }) => {
  await Promise.all([del('utilisateurs'), del('permissions')])

  await insert('permissions', permissions)
  await insert('utilisateurs', utilisateurs)
})
