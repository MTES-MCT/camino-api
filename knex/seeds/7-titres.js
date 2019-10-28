const chalk = require('chalk')
const decamelize = require('decamelize')

const seeding = require('../seeding')

const domaineIds = ['c', 'f', 'g', 'h', 'm', 'r', 's', 'w', 'reprise']

const files = [
  'titres',
  'titresDemarches',
  'titresDemarchesLiens',
  'titresPhases',
  'titresEtapes',
  'titresPoints',
  'titresPointsReferences',
  'titresDocuments',
  'titresSubstances',
  'titresTitulaires',
  'titresCommunes',
  'titresAdministrationsCentrales',
  'titresAdministrationsLocales',
  'titresAmodiataires',
  'titresIncertitudes'
]

const data = files.reduce((d, file) => {
  d[file] = domaineIds.reduce((res, domaineId) => {
    const fileName = decamelize(`titres-${domaineId}-${file}`, '-')

    let content
    try {
      content = require(`../../sources/${fileName}.json`)

      return res.concat(content)
    } catch (e) {
      console.log(chalk.red(e.message.split('\n')[0]))
    }

    return res
  }, [])

  return d
}, {})

exports.seed = seeding(async ({ del, insert }) => {
  await Promise.all([
    del('titresSubstances'),
    del('titresPointsReferences'),
    del('titresTitulaires'),
    del('titresCommunes'),
    del('titresAdministrationsCentrales'),
    del('titresAdministrationsLocales'),
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
  await insert('titresEtapes', data.titresEtapes)
  await insert('titresPhases', data.titresPhases)
  await insert('titresDemarchesLiens', data.titresDemarchesLiens)
  await insert(
    'titresAdministrationsCentrales',
    data.titresAdministrationsCentrales
  )
  await insert(
    'titresAdministrationsLocales',
    data.titresAdministrationsLocales
  )
  await insert('titresAmodiataires', data.titresAmodiataires)
  await insert('titresIncertitudes', data.titresIncertitudes)
  await insert('titresDocuments', data.titresDocuments)
  await insert('titresSubstances', data.titresSubstances)
  await insert('titresPoints', data.titresPoints)
  await insert('titresTitulaires', data.titresTitulaires)
  await insert('titresCommunes', data.titresCommunes)
  await insert('titresPointsReferences', data.titresPointsReferences)
})

exports.data = data
