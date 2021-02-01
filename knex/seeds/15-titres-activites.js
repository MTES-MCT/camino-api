const seeding = require('../seeding')

const titresActivites = require('../../sources/titres-activites.json')

const seed = seeding(async ({ insert }) => {
  await insert('titresActivites', titresActivites)
})

module.exports = seed

module.exports.seed = seed
