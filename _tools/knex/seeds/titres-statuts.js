const statuts = require('../../sources/titres-statuts.json')

exports.seed = (knex, Promise) => {
  return Promise.all([knex('titres_statuts').del()]).then(() => {
    return Promise.all([knex('titres_statuts').insert(statuts)])
  })
}
