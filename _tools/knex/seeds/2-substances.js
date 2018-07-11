const substances = require('../../sources/substances.json')
const substancesLegals = require('../../sources/substances_legals.json')

exports.seed = (knex, Promise) =>
  knex('substances')
    .del()
    .then(() => knex('substances_legals').del())
    .then(() =>
      knex('substances_legals')
        .insert(substancesLegals)
        .then(() => knex('substances').insert(substances))
    )
