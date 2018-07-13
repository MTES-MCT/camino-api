const substances = require('../../sources/substances.json')
const substancesLegals = require('../../sources/substances-legals.json')

exports.seed = (knex, Promise) =>
  knex('substances')
    .del()
    .then(() => knex('substancesLegals').del())
    .then(() =>
      knex('substancesLegals')
        .insert(substancesLegals)
        .then(() => knex('substances').insert(substances))
    )
