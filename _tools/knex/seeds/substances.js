const substances = require('../sources/substances.json')
const substanceLegals = require('../sources/substance-legals.json')

exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return Promise.all([
    knex('substances').del(),
    knex('substanceLegals').del()
  ]).then(() => {
    // Inserts seed entries
    return Promise.all([
      knex('substances').insert(substances),
      knex('substanceLegals').insert(substanceLegals)
    ])
  })
}
