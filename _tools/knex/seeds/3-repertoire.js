const entreprises = require('../../sources/entreprises.json')
const administrations = require('../../sources/administrations.json')
const utilisateurs = require('../../sources/utilisateurs.json')

exports.seed = (knex, Promise) =>
  Promise.all([
    knex('entreprises').del(),
    knex('administrations').del(),
    knex('utilisateurs').del()
  ]).then(() =>
    Promise.all([
      knex('entreprises').insert(entreprises),
      knex('administrations').insert(administrations),
      knex('utilisateurs').insert(utilisateurs)
    ])
  )
