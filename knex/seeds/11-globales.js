const seeding = require('../seeding')

const globales = require('../../sources/globales.json')

exports.seed = seeding(async ({ insert }) => {
  await insert('globales', globales)
})
