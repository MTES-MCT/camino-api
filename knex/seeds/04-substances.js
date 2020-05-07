const seeding = require('../seeding')

const substances = require('../../sources/substances.json')
const substancesLegales = require('../../sources/substances-legales.json')
const substancesLegalesCodes = require('../../sources/substances-legales-codes.json')
const substancesSubstancesLegales = require('../../sources/substances--substances-legales.json')

const seed = seeding(async ({ insert }) => {
  await insert('substancesLegalesCodes', substancesLegalesCodes)
  await insert('substancesLegales', substancesLegales)
  await insert('substances', substances)
  await insert('substances__substancesLegales', substancesSubstancesLegales)
})

module.exports = seed

module.exports.seed = seed
