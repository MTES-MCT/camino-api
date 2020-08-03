const seeding = require('../seeding')

const globales = require('../../sources/globales.json')

const seed = seeding(async ({ insert }) => {
  await insert('globales', globales)
})

module.exports = seed

module.exports.seed = seed
