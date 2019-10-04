const seeding = require('../seeding')

const pays = require('../../sources/pays.json')
const regions = require('../../sources/regions.json')
const departements = require('../../sources/departements.json')
const communes = require('../../sources/communes.json')

exports.seed = seeding(async ({ del, insert }) => {
  await del('communes')
  await del('departements')
  await del('regions')
  await del('pays')

  await insert('pays', pays)
  await insert('regions', regions)
  await insert('departements', departements)
  await insert('communes', communes)
})
