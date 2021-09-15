const seeding = require('../seeding')

/* eslint-disable camelcase */

const definitions = require('../../../sources/definitions.json')
const domaines = require('../../../sources/domaines.json')
const titresTypesTypes = require('../../../sources/titres-types-types.json')
const titresTypes = require('../../../sources/titres-types.json')
const titresStatuts = require('../../../sources/titres-statuts.json')
const titresTypes_titresStatuts = require('../../../sources/titres-types--titres-statuts.json')
const phasesStatuts = require('../../../sources/phases-statuts.json')
const demarchesTypes = require('../../../sources/demarches-types.json')
const titresTypes__demarchesTypes = require('../../../sources/titres-types--demarches-types.json')
const demarchesStatuts = require('../../../sources/demarches-statuts.json')
const etapesTypes = require('../../../sources/etapes-types.json')
const titresTypes_demarchesTypes_etapesTypes = require('../../../sources/titres-types--demarches-types--etapes-types.json')
const titresTypes_demarchesTypes_etapesTypes_documentsTypes = require('../../../sources/titres-types--demarches-types--etapes-types--documents-types.json')
const etapesStatuts = require('../../../sources/etapes-statuts.json')
const etapesTypes_etapesStatuts = require('../../../sources/etapes-types--etapes-statuts.json')
const etapesTypes_documentsTypes = require('../../../sources/etapes-types--documents-types.json')
const etapesTypes_justificatifsTypes = require('../../../sources/etapes-types--justificatifs-types.json')
const entreprises_documentsTypes = require('../../../sources/entreprises--documents-types.json')
const geoSystemes = require('../../../sources/geo-systemes.json')
const devises = require('../../../sources/devises.json')
const unites = require('../../../sources/unites.json')
const documentsTypes = require('../../../sources/documents-types.json')
const referencesTypes = require('../../../sources/references-types.json')
const permissions = require('../../../sources/permissions.json')

const seed = (module.exports = seeding(async ({ insert }) => {
  await Promise.all([
    insert('definitions', definitions),
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
    insert('referencesTypes', referencesTypes),
    insert('permissions', permissions)
  ])
  await Promise.all([
    insert('geoSystemes', geoSystemes),
    insert('titresTypes', titresTypes)
  ])
  await Promise.all([
    insert('titresTypes__titresStatuts', titresTypes_titresStatuts),
    insert('titresTypes__demarchesTypes', titresTypes__demarchesTypes),
    insert(
      'titresTypes__demarchesTypes__etapesTypes',
      titresTypes_demarchesTypes_etapesTypes
    ),
    insert(
      'titresTypes__demarchesTypes__etapesTypes__documentsTypes',
      titresTypes_demarchesTypes_etapesTypes_documentsTypes
    ),
    insert('etapesTypes__documentsTypes', etapesTypes_documentsTypes),
    insert('etapesTypes__etapesStatuts', etapesTypes_etapesStatuts),
    insert('entreprises__documents_types', entreprises_documentsTypes),
    insert('etapesTypes__justificatifsTypes', etapesTypes_justificatifsTypes)
  ])
}))

module.exports = seed

module.exports.seed = seed
