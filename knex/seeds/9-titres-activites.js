const seeding = require('../seeding')

const titresActivites = require('../../sources/titres-activites.json')

exports.seed = seeding(async ({ del, insert }) => {
  await del('titresActivites')

  await insert('titresActivites', titresActivites)
})
