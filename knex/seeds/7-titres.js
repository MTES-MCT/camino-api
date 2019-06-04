const decamelize = require('decamelize')

const seeding = require('../seeding')

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

exports.seed = seeding(async ({ del, insert }) => {
  await Promise.all([
    del('titresEmprises'),
    del('titresSubstances'),
    del('titresPointsReferences'),
    del('titresTitulaires'),
    del('titresAmodiataires'),
    del('titresIncertitudes'),
    del('titresDocuments')
  ])
  await del('titresPoints')
  await Promise.all([
    del('titresEtapes'),
    del('titresPhases'),
    del('titresDemarchesLiens')
  ])
  await del('titresDemarches')
  await del('titres')

  await insert('titres', data.titres)
  await insert('titresDemarches', data.titresDemarches)
  await Promise.all([
    insert('titresEtapes', data.titresEtapes),
    insert('titresDemarchesLiens', data.titresDemarchesLiens)
  ])
  await Promise.all([
    insert('titresSubstances', data.titresSubstances),
    insert('titresPoints', data.titresPoints),
    insert('titresEmprises', data.titresEmprises),
    insert('titresTitulaires', data.titresTitulaires),
    insert('titresAmodiataires', data.titresAmodiataires),
    insert('titresIncertitudes', data.titresIncertitudes),
    insert('titresDocuments', data.titresDocuments)
  ])
  await insert('titresPointsReferences', data.titresPointsReferences)
})

exports.data = data
