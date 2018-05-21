const travaux = require('../../sources/titres-travaux.json')

exports.seed = (knex, Promise) => {
  return Promise.all([knex('titresTravaux').del()]).then(() => {
    return Promise.all([knex('titresTravaux').insert(travaux)])
  })
}
