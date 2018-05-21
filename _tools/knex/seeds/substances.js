const substances = require('../../sources/substances.json')
const substancesLegals = require('../../sources/substances-legals.json')

exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return Promise.all([
    knex('substances').del(),
    knex('substancesLegals').del()
  ]).then(() => {
    // Inserts seed entries
    return Promise.all([
      knex('substances').insert(substances),
      knex('substancesLegals').insert(substancesLegals)
    ])
  })
}
