const emprises = require('../../sources/titres-emprises.json')

exports.seed = (knex, Promise) =>
  Promise.all([knex('titresEmprises').del()]).then(() =>
    Promise.all([knex('titresEmprises').insert(emprises)])
  )
