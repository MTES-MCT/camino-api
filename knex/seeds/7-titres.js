const decamelize = require('decamelize')

const domaineIds = ['c', 'f', 'g', 'h', 'm', 'm973', 'r', 's', 'w']

const files = [
  'titres',
  'titresDemarches',
  'titresDemarchesLiens',
  'titresEtapes',
  'titresEmprises',
  'titresPoints',
  'titresPointsReferences',
  'titresDocuments',
  'titresSubstances',
  'titresTitulaires',
  'titresAmodiataires',
  'titresIncertitudes'
]

const data = files.reduce(
  (d, file) => ({
    ...d,
    [file]: domaineIds.reduce((res, domaineId) => {
      const fileName = decamelize(`titres-${domaineId}-${file}`, '-')
      return [...res, ...require(`../../sources/${fileName}.json`)]
    }, [])
  }),
  {}
)

exports.seed = (knex, Promise) =>
  Promise.all([
    knex('titresEmprises').del(),
    knex('titresSubstances').del(),
    knex('titresPointsReferences').del(),
    knex('titresTitulaires').del(),
    knex('titresAmodiataires').del(),
    knex('titresIncertitudes').del(),
    knex('titresDocuments').del()
  ])
    .then(() => knex('titresPoints').del())
    .then(() =>
      Promise.all([
        knex('titresEtapes').del(),
        knex('titresPhases').del(),
        knex('titresDemarchesLiens').del()
      ])
    )
    .then(() => knex('titresDemarches').del())
    .then(() => knex('titres').del())
    .then(() => knex('titres').insert(data.titres))
    .then(() => knex('titresDemarches').insert(data.titresDemarches))
    .then(() =>
      Promise.all([
        knex('titresEtapes').insert(data.titresEtapes),
        knex('titresDemarchesLiens').insert(data.titresDemarchesLiens)
      ])
    )
    .then(() =>
      Promise.all([
        knex('titresSubstances').insert(data.titresSubstances),
        knex('titresPoints').insert(data.titresPoints),
        knex('titresEmprises').insert(data.titresEmprises),
        knex('titresTitulaires').insert(data.titresTitulaires),
        knex('titresAmodiataires').insert(data.titresAmodiataires),
        knex('titresIncertitudes').insert(data.titresIncertitudes),
        knex('titresDocuments').insert(data.titresDocuments)
      ])
    )
    .then(() =>
      knex('titresPointsReferences').insert(data.titresPointsReferences)
    )

exports.data = data
