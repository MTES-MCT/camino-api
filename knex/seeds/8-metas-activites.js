const activitesStatuts = require('../../sources/activites-statuts.json')
const activitesTypes = require('../../sources/activites-types.json')
// eslint-disable-next-line camelcase
const activitesTypes_types = require('../../sources/activites-types--types.json')
// eslint-disable-next-line camelcase
const activitesTypes_pays = require('../../sources/activites-types--pays.json')

exports.seed = (knex, Promise) =>
  knex('communes')
    .del()
    .then(() => knex('activitesTypes__pays').del())
    .then(() => knex('activitesTypes__types').del())
    .then(() => knex('activitesTypes').del())
    .then(() => knex('activitesStatuts').del())
    .then(() => knex('activitesStatuts').insert(activitesStatuts))
    .then(() => knex('activitesTypes').insert(activitesTypes))
    .then(() => knex('activitesTypes__types').insert(activitesTypes_types))
    .then(() => knex('activitesTypes__pays').insert(activitesTypes_pays))
