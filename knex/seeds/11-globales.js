const seeding = require('../seeding')

const globales = require('../../sources/globales.json')

exports.seed = seeding(async ({ del, insert }) => {
  await insert('globales', globales)
})
