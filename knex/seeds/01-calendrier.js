const seeding = require('../seeding')

const frequences = require('../../sources/frequences.json')
const annees = require('../../sources/annees.json')
const trimestres = require('../../sources/trimestres.json')
const mois = require('../../sources/mois.json')

exports.seed = seeding(async ({ del, insert }) => {
  await insert('frequences', frequences)
  await insert('trimestres', trimestres)
  await insert('annees', annees)
  await insert('mois', mois)
})
