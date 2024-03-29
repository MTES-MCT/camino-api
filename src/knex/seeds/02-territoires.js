const seeding = require('../seeding')

const pays = require('../../../sources/pays.json')
const regions = require('../../../sources/regions.json')
const departements = require('../../../sources/departements.json')

const seed = seeding(async ({ insert }) => {
  await insert('pays', pays)
  await insert('regions', regions)
  await insert('departements', departements)
})

module.exports = seed

module.exports.seed = seed
