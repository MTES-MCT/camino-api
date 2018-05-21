const substances = require('../../sources/titres-substances.json')
const substancesLegals = require('../../sources/titres-substances-legals.json')

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
