const seeding = require('../seeding')

const substances = require('../../sources/substances.json')
const substancesLegales = require('../../sources/substances-legales.json')
const substancesLegalesCodes = require('../../sources/substances-legales-codes.json')
const substancesSubstancesLegales = require('../../sources/substances--substances-legales.json')
const substancesFiscales = require('../../sources/substances-fiscales.json')

const seed = seeding(async ({ insert }) => {
  await insert('substancesLegalesCodes', substancesLegalesCodes)
  await insert('substancesLegales', substancesLegales)
  await insert('substances', substances)
  await insert('substances__substancesLegales', substancesSubstancesLegales)
  await insert('substancesFiscales', substancesFiscales)
})

module.exports = seed

module.exports.seed = seed
