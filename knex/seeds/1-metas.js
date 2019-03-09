const domaines = require('../../sources/domaines.json')
const types = require('../../sources/types.json')
// eslint-disable-next-line camelcase
const domaines_types = require('../../sources/domaines--types.json')
const statuts = require('../../sources/statuts.json')
const phasesStatuts = require('../../sources/phases-statuts.json')
const demarchesTypes = require('../../sources/demarches-types.json')
// eslint-disable-next-line camelcase
const demarchesTypes_types = require('../../sources/demarches-types--types.json')
const demarchesStatuts = require('../../sources/demarches-statuts.json')
// eslint-disable-next-line camelcase
const demarchesTypes_demarchesStatuts = require('../../sources/demarches-types--demarches-statuts.json')
const etapesTypes = require('../../sources/etapes-types.json')
// eslint-disable-next-line camelcase
const demarchesTypes_etapesTypes = require('../../sources/demarches-types--etapes-types.json')
const etapesStatuts = require('../../sources/etapes-statuts.json')
// eslint-disable-next-line camelcase
const etapesTypes_etapesStatuts = require('../../sources/etapes-types--etapes-statuts.json')
const emprises = require('../../sources/emprises.json')
const geoSystemes = require('../../sources/geo-systemes.json')
const devises = require('../../sources/devises.json')
const volumeUnites = require('../../sources/volume-unites.json')

exports.seed = (knex, Promise) =>
  Promise.all([
    knex('domaines__types').del(),
    knex('demarchesTypes__types').del(),
    knex('demarchesTypes__etapesTypes').del(),
    knex('demarchesTypes__demarchesStatuts').del(),
    knex('etapesTypes__etapesStatuts').del(),
    knex('statuts').del(),
    knex('emprises').del(),
    knex('geoSystemes').del(),
    knex('devises').del(),
    knex('volumeUnites').del()
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
        knex('etapesStatuts').insert(etapesStatuts),
        knex('geoSystemes').insert(geoSystemes),
        knex('devises').insert(devises),
        knex('volumeUnites').insert(volumeUnites)
      ])
    )
    .then(() =>
      Promise.all([
        knex('domaines__types').insert(domaines_types),
        knex('demarchesTypes__types').insert(demarchesTypes_types),
        knex('demarchesTypes__demarchesStatuts').insert(
          demarchesTypes_demarchesStatuts
        ),
        knex('demarchesTypes__etapesTypes').insert(demarchesTypes_etapesTypes),
        knex('etapesTypes__etapesStatuts').insert(etapesTypes_etapesStatuts)
      ])
    )
