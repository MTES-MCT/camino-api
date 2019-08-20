const seeding = require('../seeding')

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

exports.seed = seeding(async ({ del, insert }) => {
  await Promise.all([
    del('domaines__types'),
    del('demarchesTypes__types'),
    del('demarchesTypes__etapesTypes'),
    del('etapesTypes__etapesStatuts'),
    del('statuts'),
    del('emprises'),
    del('geoSystemes'),
    del('devises'),
    del('volumeUnites')
  ])
  await Promise.all([
    del('phasesStatuts'),
    del('demarchesTypes'),
    del('etapesTypes'),
    del('demarchesStatuts'),
    del('etapesStatuts')
  ])
  await Promise.all([del('domaines'), del('types')])

  await Promise.all([
    insert('domaines', domaines),
    insert('types', types),
    insert('statuts', statuts),
    insert('phasesStatuts', phasesStatuts),
    insert('demarchesTypes', demarchesTypes),
    insert('etapesTypes', etapesTypes),
    insert('emprises', emprises),
    insert('demarchesStatuts', demarchesStatuts),
    insert('etapesStatuts', etapesStatuts),
    insert('geoSystemes', geoSystemes),
    insert('devises', devises),
    insert('volumeUnites', volumeUnites)
  ])
  await Promise.all([
    insert('domaines__types', domaines_types),
    insert('demarchesTypes__types', demarchesTypes_types),
    insert('demarchesTypes__etapesTypes', demarchesTypes_etapesTypes),
    insert('etapesTypes__etapesStatuts', etapesTypes_etapesStatuts)
  ])
})
