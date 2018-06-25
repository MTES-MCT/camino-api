const substances = require('../../sources/substances.json')
const substancesLegals = require('../../sources/substances_legals.json')

exports.seed = (knex, Promise) =>
  Promise.all([knex('substances').del(), knex('substances_legals').del()]).then(
    () =>
      Promise.all([
        knex('substances').insert(substances),
        knex('substances_legals').insert(substancesLegals)
      ])
  )
