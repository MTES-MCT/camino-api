const sourcesImport = require('../_sources-import')
const seeding = require('../_seeding')

const data = sourcesImport([
  'restrictions_domaines',
  'restrictions_types_administrations',
  'restrictions_types_statuts',
  'restrictions_types_statuts_administrations',
  'restrictions_etapesTypes',
  'restrictions_etapesTypes_administrations'
])

exports.seed = seeding(async ({ del, insert }) => {
  await Promise.all([
    del('restrictions__domaines'),
    del('restrictions__types__administrations'),
    del('restrictions__types__statuts'),
    del('restrictions__types__statuts__administrations'),
    del('restrictions__etapesTypes'),
    del('restrictions__etapesTypes__administrations')
  ])

  await Promise.all([
    insert('restrictions__domaines', data.restrictions_domaines),
    insert(
      'restrictions__types__administrations',
      data.restrictions_types_administrations
    ),
    insert('restrictions__types__statuts', data.restrictions_types_statuts),
    insert(
      'restrictions__types__statuts__administrations',
      data.restrictions_types_statuts_administrations
    ),
    insert('restrictions__etapesTypes', data.restrictions_etapesTypes),
    insert(
      'restrictions__etapesTypes__administrations',
      data.restrictions_etapesTypes_administrations
    )
  ])
})
