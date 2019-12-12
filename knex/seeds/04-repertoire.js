const sourcesImport = require('../_sources-import')
const seeding = require('../_seeding')

const data = sourcesImport([
  'entreprises',
  'entreprisesEtablissements',

  'administrations',
  'administrationsTypes',
  'administrations_domaines'
])

const findMissing = (elements, relations, field1, field2) =>
  relations.forEach(r => {
    if (!elements.find(e => r[field2] === e[field1])) {
      throw new Error(`Missing: ${field1} <-> ${field2} = "${r[field2]}"`)
    }
  })

findMissing(
  data.entreprises,
  data.entreprisesEtablissements,
  'id',
  'entreprise_id'
)
findMissing(data.administrationsTypes, data.administrations, 'id', 'type_id')

exports.seed = seeding(async ({ del, insert }) => {
  await Promise.all([del('entreprisesEtablissements'), del('administrations')])
  await del('entreprises')

  await Promise.all([
    insert('entreprises', data.entreprises),
    insert('administrations_types', data.administrationsTypes)
  ])
  await insert('administrations', data.administrations)
  await insert('administrations__domaines', data.administrations_domaines)
  await insert('entreprisesEtablissements', data.entreprisesEtablissements)
})
