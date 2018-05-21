const statuts = require('../../sources/titres-statuts.json')

exports.seed = (knex, Promise) => {
  return Promise.all([knex('titresStatuts').del()]).then(() => {
    return Promise.all([knex('titresStatuts').insert(statuts)])
  })
}
