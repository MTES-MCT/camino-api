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
  'titresAdministrationsGestionnaires',
  'titresAdministrationsLocales',
  'titresAmodiataires',
  'titresIncertitudes',
  'titresReferences'
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
  await insert('titres', data.titres)
  await insert('titresDemarches', data.titresDemarches)
  await insert('titresReferences', data.titresReferences)
  await insert('titresEtapes', data.titresEtapes)
  await insert('titresPhases', data.titresPhases)
  await insert('titresDemarchesLiens', data.titresDemarchesLiens)
  await insert(
    'titresAdministrationsGestionnaires',
    data.titresAdministrationsGestionnaires
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
