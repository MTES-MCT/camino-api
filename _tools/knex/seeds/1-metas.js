const domaines = require('../../sources/domaines.json')
const types = require('../../sources/types.json')
const statuts = require('../../sources/statuts.json')
const domainesTypes = require('../../sources/domaines-types.json')
const demarches = require('../../sources/demarches.json')
const demarchesStatuts = require('../../sources/demarches-statuts.json')
const etapes = require('../../sources/etapes.json')
const etapesStatuts = require('../../sources/etapes-statuts.json')
const emprises = require('../../sources/emprises.json')
const demarchesEtapes = require('../../sources/demarches-etapes.json')

exports.seed = (knex, Promise) =>
  Promise.all([
    knex('domainesTypes').del(),
    knex('demarchesEtapes').del(),
    knex('statuts').del(),
    knex('emprises').del(),
    knex('demarches').del(),
    knex('demarchesStatuts').del(),
    knex('etapes').del(),
    knex('etapesStatuts').del()
  ])
    .then(() => Promise.all([knex('domaines').del(), knex('types').del()]))
    .then(() =>
      Promise.all([
        knex('domaines').insert(domaines),
        knex('types').insert(types),
        knex('statuts').insert(statuts)
      ])
        .then(() =>
          Promise.all([
            knex('demarches').insert(demarches),
            knex('demarchesStatuts').insert(demarchesStatuts),
            knex('etapes').insert(etapes),
            knex('etapesStatuts').insert(etapesStatuts),
            knex('emprises').insert(emprises)
          ])
        )
        .then(() =>
          Promise.all([
            knex('domainesTypes').insert(domainesTypes),
            knex('demarchesEtapes').insert(demarchesEtapes)
          ])
        )
    )
