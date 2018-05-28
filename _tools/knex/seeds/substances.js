const substances = require('../../sources/substances.json')
const substancesLegals = require('../../sources/substances-legals.json')

exports.seed = (knex, Promise) =>
  Promise.all([knex('substances').del(), knex('substancesLegals').del()]).then(
    () =>
      Promise.all([
        knex('substances').insert(substances),
        knex('substancesLegals').insert(substancesLegals)
      ])
  )
