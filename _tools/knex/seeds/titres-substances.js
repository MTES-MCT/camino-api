const substances = require('../../sources/substances.json')
const substancesLegals = require('../../sources/substances-legals.json')

exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return Promise.all([
    knex('titres_substances').del(),
    knex('titres_substances_legals').del()
  ]).then(() => {
    // Inserts seed entries
    return Promise.all([
      knex('titres_substances').insert(substances),
      knex('titres_substances_legals').insert(substancesLegals)
    ])
  })
}
