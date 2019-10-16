const seeding = require('../seeding')

const utilisateurs = require('../../sources/utilisateurs.json')
const utilisateursEntreprises = require('../../sources/utilisateurs--entreprises.json')
const utilisateursAdministrations = require('../../sources/utilisateurs--administrations.json')
const permissions = require('../../sources/permissions.json')

exports.seed = seeding(async ({ del, insert }) => {
  await del('utilisateurs__administrations')
  await del('utilisateurs__entreprises')
  await del('utilisateurs')
  await del('permissions')

  await insert('permissions', permissions)
  await insert('utilisateurs', utilisateurs)
  await insert('utilisateurs__entreprises', utilisateursEntreprises)
  await insert('utilisateurs__administrations', utilisateursAdministrations)
})
