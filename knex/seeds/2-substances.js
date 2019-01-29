const substances = require('../../sources/substances.json')
const substancesLegales = require('../../sources/substances-legales.json')
const substancesLegalesCodes = require('../../sources/substances-legales-codes.json')
const substancesSubstancesLegales = require('../../sources/substances--substances-legales.json')

exports.seed = (knex, Promise) =>
  knex('substances')
    .del()
    .then(() => knex('substances__substancesLegales').del())
    .then(() => knex('substancesLegales').del())
    .then(() => knex('substancesLegalesCodes').del())
    .then(() => knex('substancesLegalesCodes').insert(substancesLegalesCodes))
    .then(() => knex('substancesLegales').insert(substancesLegales))
    .then(() => knex('substances').insert(substances))
    .then(() =>
      knex('substances__substancesLegales').insert(substancesSubstancesLegales)
    )
