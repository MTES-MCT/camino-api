const emprises = require('../../sources/titres-emprises.json')

exports.seed = (knex, Promise) => {
  return Promise.all([knex('titresEmprises').del()]).then(() => {
    return Promise.all([knex('titresEmprises').insert(emprises)])
  })
}
