const seeding = require('../seeding')

const administrations = require('../../sources/administrations.json')
const administrationsTypes = require('../../sources/administrations-types.json')

exports.seed = seeding(async ({ insert }) => {
  await insert('administrationsTypes', administrationsTypes)
  await insert('administrations', administrations)
})
