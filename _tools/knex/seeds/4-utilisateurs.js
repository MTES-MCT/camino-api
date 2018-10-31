const utilisateurs = require('../../sources/utilisateurs.json')
const permissions = require('../../sources/permissions.json')

exports.seed = (knex, Promise) =>
  Promise.all([knex('utilisateurs').del(), knex('permissions').del()]).then(
    () =>
      Promise.all([
        knex('permissions').insert(permissions),
        knex('utilisateurs').insert(utilisateurs)
      ])
  )
