const utilisateurs = require('../../sources/repertoire-utilisateurs.json')
const groupes = require('../../sources/repertoire-groupes.json')
const utilisateursGroupes = require('../../sources/repertoire-utilisateurs-groupes.json')

exports.seed = (knex, Promise) =>
  knex('utilisateursGroupes')
    .del()
    .then(() =>
      Promise.all([knex('utilisateurs').del(), knex('groupes').del()])
    )
    .then(() =>
      Promise.all([
        knex('utilisateurs').insert(utilisateurs),
        knex('groupes').insert(groupes)
      ])
    )
    .then(() => knex('utilisateursGroupes').insert(utilisateursGroupes))
