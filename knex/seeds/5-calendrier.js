const seeding = require('../seeding')

const frequences = require('../../sources/frequences.json')
const trimestres = require('../../sources/trimestres.json')
const mois = require('../../sources/mois.json')

exports.seed = seeding(async ({ del, insert }) => {
  await del('communes')
  await del('mois')
  await del('trimestres')
  await del('frequences')

  await insert('frequences', frequences)
  await insert('trimestres', trimestres)
  await insert('mois', mois)
})
