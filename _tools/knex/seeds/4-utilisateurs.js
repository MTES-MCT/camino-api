const utilisateurs = require('../../sources/repertoire-utilisateurs.json')
const permissions = require('../../sources/repertoire-permissions.json')
const utilisateursPermissions = require('../../sources/repertoire-utilisateurs-permissions.json')

exports.seed = (knex, Promise) =>
  knex('utilisateursPermissions')
    .del()
    .then(() =>
      Promise.all([knex('utilisateurs').del(), knex('permissions').del()])
    )
    .then(() =>
      Promise.all([
        knex('utilisateurs').insert(utilisateurs),
        knex('permissions').insert(permissions)
      ])
    )
    .then(() => knex('utilisateursPermissions').insert(utilisateursPermissions))
