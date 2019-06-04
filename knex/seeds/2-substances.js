const seeding = require('../seeding')

const substances = require('../../sources/substances.json')
const substancesLegales = require('../../sources/substances-legales.json')
const substancesLegalesCodes = require('../../sources/substances-legales-codes.json')
const substancesSubstancesLegales = require('../../sources/substances--substances-legales.json')

exports.seed = seeding(async ({ del, insert }) => {
  await del('substances')
  await del('substances__substancesLegales')
  await del('substancesLegales')
  await del('substancesLegalesCodes')

  await insert('substancesLegalesCodes', substancesLegalesCodes)
  await insert('substancesLegales', substancesLegales)
  await insert('substances', substances)
  await insert('substances__substancesLegales', substancesSubstancesLegales)
})
