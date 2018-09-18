const domaines = require('../../sources/domaines.json')
const types = require('../../sources/types.json')
const domainesTypes = require('../../sources/domaines--types.json')
const statuts = require('../../sources/statuts.json')
const phasesStatuts = require('../../sources/phases-statuts.json')
const demarches = require('../../sources/demarches.json')
const demarchesTypes = require('../../sources/demarches--types.json')
const demarchesStatuts = require('../../sources/demarches-statuts.json')
const demarchesDemarchesStatuts = require('../../sources/demarches--demarches-statuts.json')
const etapes = require('../../sources/etapes.json')
const demarchesEtapes = require('../../sources/demarches--etapes.json')
const etapesStatuts = require('../../sources/etapes-statuts.json')
const etapesEtapesStatuts = require('../../sources/etapes--etapes-statuts.json')
const emprises = require('../../sources/emprises.json')

exports.seed = (knex, Promise) =>
  Promise.all([
    knex('domaines__types').del(),
    knex('demarches__types').del(),
    knex('demarches__etapes').del(),
    knex('demarches__demarchesStatuts').del(),
    knex('etapes__etapesStatuts').del(),
    knex('statuts').del(),
    knex('emprises').del()
  ])
    .then(() =>
      Promise.all([
        knex('phasesStatuts').del(),
        knex('demarches').del(),
        knex('etapes').del(),
        knex('demarchesStatuts').del(),
        knex('etapesStatuts').del()
      ])
    )
    .then(() => Promise.all([knex('domaines').del(), knex('types').del()]))
    .then(() =>
      Promise.all([
        knex('domaines').insert(domaines),
        knex('types').insert(types),
        knex('statuts').insert(statuts),
        knex('phasesStatuts').insert(phasesStatuts),
        knex('demarches').insert(demarches),
        knex('etapes').insert(etapes),
        knex('emprises').insert(emprises),
        knex('demarchesStatuts').insert(demarchesStatuts),
        knex('etapesStatuts').insert(etapesStatuts)
      ])
    )
    .then(() =>
      Promise.all([
        knex('domaines__types').insert(domainesTypes),
        knex('demarches__types').insert(demarchesTypes),
        knex('demarches__demarchesStatuts').insert(demarchesDemarchesStatuts),
        knex('demarches__etapes').insert(demarchesEtapes),
        knex('etapes__etapesStatuts').insert(etapesEtapesStatuts)
      ])
    )
