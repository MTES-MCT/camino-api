const frequences = require('../../sources/frequences.json')
const trimestres = require('../../sources/trimestres.json')
const mois = require('../../sources/mois.json')

exports.seed = (knex, Promise) =>
  knex('communes')
    .del()
    .then(() => knex('mois').del())
    .then(() => knex('trimestres').del())
    .then(() => knex('frequences').del())
    .then(() => knex('frequences').insert(frequences))
    .then(() => knex('trimestres').insert(trimestres))
    .then(() => knex('mois').insert(mois))
