const sourcesImport = require('../_sources-import')
const seeding = require('../_seeding')

const data = sourcesImport([
  'domaines',
  'types',
  'domaines_types',
  'statuts',
  'phasesStatuts',
  'demarchesTypes',
  'demarchesTypes_types',
  'demarchesStatuts',
  'etapesTypes',
  'demarchesTypes_etapesTypes',
  'etapesStatuts',
  'etapesTypes_etapesStatuts',
  'geoSystemes',
  'devises',
  'unites',
  'documentsTypes',
  'referencesTypes'
])

exports.seed = seeding(async ({ del, insert }) => {
  await Promise.all([
    del('domaines__types'),
    del('demarchesTypes__types'),
    del('demarchesTypes__etapesTypes'),
    del('etapesTypes__etapesStatuts'),
    del('statuts'),
    del('geoSystemes'),
    del('devises'),
    del('unites'),
    del('referencesTypes')
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
    insert('domaines', data.domaines),
    insert('types', data.types),
    insert('statuts', data.statuts),
    insert('phasesStatuts', data.phasesStatuts),
    insert('demarchesTypes', data.demarchesTypes),
    insert('etapesTypes', data.etapesTypes),
    insert('demarchesStatuts', data.demarchesStatuts),
    insert('etapesStatuts', data.etapesStatuts),
    insert('documentsTypes', data.documentsTypes),
    insert('devises', data.devises),
    insert('unites', data.unites),
    insert('referencesTypes', data.referencesTypes)
  ])
  await Promise.all([
    insert('geoSystemes', data.geoSystemes),
    insert('domaines__types', data.domaines_types),
    insert('demarchesTypes__types', data.demarchesTypes_types),
    insert('demarchesTypes__etapesTypes', data.demarchesTypes_etapesTypes),
    insert('etapesTypes__etapesStatuts', data.etapesTypes_etapesStatuts)
  ])
})
