const substances = require('../../sources/substances.json')
const substancesLegals = require('../../sources/substances-legals.json')
const substancesLegalsCodes = require('../../sources/substances-legals-codes.json')
const substancesSubstancesLegals = require('../../sources/substances--substances-legals.json')

exports.seed = (knex, Promise) =>
  knex('substances')
    .del()
    .then(() => knex('substances__substancesLegals').del())
    .then(() => knex('substancesLegals').del())
    .then(() => knex('substancesLegalsCodes').del())
    .then(() => knex('substancesLegalsCodes').insert(substancesLegalsCodes))
    .then(() => knex('substancesLegals').insert(substancesLegals))
    .then(() => knex('substances').insert(substances))
    .then(() =>
      knex('substances__substancesLegals').insert(substancesSubstancesLegals)
    )
