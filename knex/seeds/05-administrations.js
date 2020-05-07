const seeding = require('../seeding')

const administrations = require('../../sources/administrations.json')
const administrationsTypes = require('../../sources/administrations-types.json')

const seed = seeding(async ({ insert }) => {
  await insert('administrationsTypes', administrationsTypes)
  await insert('administrations', administrations)
})

module.exports = seed

module.exports.seed = seed
