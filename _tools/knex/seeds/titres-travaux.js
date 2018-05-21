const travaux = require('../../sources/titres-travaux.json')

exports.seed = (knex, Promise) => {
  return Promise.all([knex('titres_travaux').del()]).then(() => {
    return Promise.all([knex('titres_travaux').insert(travaux)])
  })
}
