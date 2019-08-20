const dateFormat = require('dateformat')

const seeding = require('../seeding')

const titresActivites = require('../../sources/titres-activites.json')

const activites = titresActivites.map(tr => {
  tr.date = dateFormat(tr.date, 'yyyy-mm-dd')

  return tr
})

exports.seed = seeding(async ({ del, insert }) => {
  await del('titresActivites')

  await insert('titresActivites', activites)
})
