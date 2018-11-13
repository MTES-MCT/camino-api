const domaines = require('../../sources/domaines.json')
const types = require('../../sources/types.json')
const domaines_types = require('../../sources/domaines--types.json')
const statuts = require('../../sources/statuts.json')
const phasesStatuts = require('../../sources/phases-statuts.json')
const demarchesTypes = require('../../sources/demarches-types.json')
const demarchesTypes_types = require('../../sources/demarches-types--types.json')
const demarchesStatuts = require('../../sources/demarches-statuts.json')
const demarchesTypes_DemarchesStatuts = require('../../sources/demarches-types--demarches-statuts.json')
const etapesTypes = require('../../sources/etapes-types.json')
const demarchesTypes_EtapesTypes = require('../../sources/demarches-types--etapes-types.json')
const etapesStatuts = require('../../sources/etapes-statuts.json')
const etapesTypes_EtapesStatuts = require('../../sources/etapes-types--etapes-statuts.json')
const emprises = require('../../sources/emprises.json')

exports.seed = (knex, Promise) =>
  Promise.all([
    knex('domaines__types').del(),
    knex('demarchesTypes__types').del(),
    knex('demarchesTypes__etapesTypes').del(),
    knex('demarchesTypes__demarchesStatuts').del(),
    knex('etapesTypes__etapesStatuts').del(),
    knex('statuts').del(),
    knex('emprises').del()
  ])
    .then(() =>
      Promise.all([
        knex('phasesStatuts').del(),
        knex('demarchesTypes').del(),
        knex('etapesTypes').del(),
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
        knex('demarchesTypes').insert(demarchesTypes),
        knex('etapesTypes').insert(etapesTypes),
        knex('emprises').insert(emprises),
        knex('demarchesStatuts').insert(demarchesStatuts),
        knex('etapesStatuts').insert(etapesStatuts)
      ])
    )
    .then(() =>
      Promise.all([
        knex('domaines__types').insert(domaines_types),
        knex('demarchesTypes__types').insert(demarchesTypes_types),
        knex('demarchesTypes__demarchesStatuts').insert(
          demarchesTypes_DemarchesStatuts
        ),
        knex('demarchesTypes__etapesTypes').insert(demarchesTypes_EtapesTypes),
        knex('etapesTypes__etapesStatuts').insert(etapesTypes_EtapesStatuts)
      ])
    )
