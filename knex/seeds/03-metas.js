const seeding = require('../seeding')

const domaines = require('../../sources/domaines.json')
const titresTypesTypes = require('../../sources/titres-types-types.json')
// eslint-disable-next-line camelcase
const titresTypes = require('../../sources/titres-types.json')
const titresStatuts = require('../../sources/titres-statuts.json')
const phasesStatuts = require('../../sources/phases-statuts.json')
const demarchesTypes = require('../../sources/demarches-types.json')
// eslint-disable-next-line camelcase
const titresTypes__demarchesTypes = require('../../sources/titres-types--demarches-types.json')
const demarchesStatuts = require('../../sources/demarches-statuts.json')
const etapesTypes = require('../../sources/etapes-types.json')
// eslint-disable-next-line camelcase
const titresTypes_demarchesTypes_etapesTypes = require('../../sources/titres-types--demarches-types--etapes-types.json')
const etapesStatuts = require('../../sources/etapes-statuts.json')
// eslint-disable-next-line camelcase
const etapesTypes_etapesStatuts = require('../../sources/etapes-types--etapes-statuts.json')
const geoSystemes = require('../../sources/geo-systemes.json')
const devises = require('../../sources/devises.json')
const unites = require('../../sources/unites.json')
const documentsTypes = require('../../sources/documents-types.json')
const referencesTypes = require('../../sources/references-types.json')

exports.seed = seeding(async ({ insert }) => {
  await Promise.all([
    insert('domaines', domaines),
    insert('titresTypesTypes', titresTypesTypes),
    insert('titresStatuts', titresStatuts),
    insert('phasesStatuts', phasesStatuts),
    insert('demarchesTypes', demarchesTypes),
    insert('etapesTypes', etapesTypes),
    insert('demarchesStatuts', demarchesStatuts),
    insert('etapesStatuts', etapesStatuts),
    insert('documentsTypes', documentsTypes),
    insert('devises', devises),
    insert('unites', unites),
    insert('referencesTypes', referencesTypes)
  ])
  await Promise.all([
    insert('geoSystemes', geoSystemes),
    insert('titresTypes', titresTypes)
  ])
  await Promise.all([
    insert('titresTypes__demarchesTypes', titresTypes__demarchesTypes),
    insert(
      'titresTypes__demarchesTypes__etapesTypes',
      titresTypes_demarchesTypes_etapesTypes
    ),
    insert('etapesTypes__etapesStatuts', etapesTypes_etapesStatuts)
  ])
})
