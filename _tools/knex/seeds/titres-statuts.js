const statuts = require('../../sources/titres-statuts.json')

exports.seed = (knex, Promise) =>
  Promise.all([knex('titresStatuts').del()]).then(() =>
    Promise.all([knex('titresStatuts').insert(statuts)])
  )
