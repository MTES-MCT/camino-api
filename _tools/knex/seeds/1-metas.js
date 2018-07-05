const domaines = require('../../sources/domaines.json')
const types = require('../../sources/types.json')
const statuts = require('../../sources/statuts.json')
const domainesTypes = require('../../sources/_domaines_types.json')
const demarches = require('../../sources/demarches.json')
const demarchesStatuts = require('../../sources/demarches_statuts.json')
const etapes = require('../../sources/etapes.json')
const etapesStatuts = require('../../sources/etapes_statuts.json')
const emprises = require('../../sources/emprises.json')
const demarchesEtapes = require('../../sources/_demarches_etapes.json')

exports.seed = (knex, Promise) =>
  Promise.all([
    knex('domaines').insert(domaines),
    knex('types').insert(types),
    knex('statuts').insert(statuts)
  ])
    .then(() =>
      Promise.all([
        knex('demarches').insert(demarches),
        knex('demarches_statuts').insert(demarchesStatuts),
        knex('etapes').insert(etapes),
        knex('etapes_statuts').insert(etapesStatuts),
        knex('emprises').insert(emprises)
      ])
    )
    .then(() =>
      Promise.all([
        knex('_domaines_types').insert(domainesTypes),
        knex('_demarches_etapes').insert(demarchesEtapes)
      ])
    )
