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
  'titresErreurs'
]

const datas = files.reduce(
  (d, file) =>
    Object.assign(d, {
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
    knex('titresErreurs').del(),
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
    .then(() => knex('titres').insert(datas.titres))
    .then(() => knex('titresDemarches').insert(datas.titresDemarches))
    .then(() =>
      Promise.all([
        knex('titresEtapes').insert(datas.titresEtapes),
        knex('titresDemarchesLiens').insert(datas.titresDemarchesLiens)
      ])
    )
    .then(() =>
      Promise.all([
        knex('titresSubstances').insert(datas.titresSubstances),
        knex('titresPoints').insert(datas.titresPoints),
        knex('titresEmprises').insert(datas.titresEmprises),
        knex('titresTitulaires').insert(datas.titresTitulaires),
        knex('titresAmodiataires').insert(datas.titresAmodiataires),
        knex('titresErreurs').insert(datas.titresErreurs),
        knex('titresDocuments').insert(datas.titresDocuments)
      ])
    )
    .then(() =>
      knex('titresPointsReferences').insert(datas.titresPointsReferences)
    )
