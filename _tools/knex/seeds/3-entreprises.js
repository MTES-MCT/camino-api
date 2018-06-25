const { dedup } = require('../../utils')

const mEntreprises = require('../../sources/titres/m/entreprises.json')

const entreprises = dedup(mEntreprises)

exports.seed = (knex, Promise) =>
  Promise.all([knex('entreprises').del()]).then(() =>
    knex('entreprises').insert(entreprises)
  )
