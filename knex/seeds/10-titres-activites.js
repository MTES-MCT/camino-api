const seeding = require('../seeding')

const titresActivites = require('../../sources/titres-activites.json')

exports.seed = seeding(async ({ insert }) => {
  await insert('titresActivites', titresActivites)
})
