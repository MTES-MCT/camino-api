const utilisateurs = require('../../sources/repertoire-utilisateurs.json')
const permissions = require('../../sources/repertoire-permissions.json')

exports.seed = (knex, Promise) =>
  Promise.all([knex('utilisateurs').del(), knex('permissions').del()])
  .then(() =>
    Promise.all([
      knex('permissions').insert(permissions),
      knex('utilisateurs').insert(utilisateurs)
    ])
  )
