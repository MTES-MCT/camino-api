const chalk = require('chalk')
const decamelize = require('decamelize')
const communes = require('../../sources/communes.json')
const forets = require('../../sources/forets.json')

const seeding = require('../seeding')

const domainesIds = ['c', 'f', 'g', 'h', 'm', 'r', 's', 'w']

const files = [
  'titres',
  'titresDemarches',
  'titresDemarchesLiens',
  'titresPhases',
  'titresEtapes',
  'titresPoints',
  'titresPointsReferences',
  'titresSubstances',
  'titresTitulaires',
  'titresCommunes',
  'titresForets',
  'titresAdministrationsGestionnaires',
  'titresAdministrationsLocales',
  'titresAmodiataires',
  'titresIncertitudes',
  'titresReferences'
]

const data = files.reduce((d, file) => {
  d[file] = domainesIds.reduce((res, domaineId) => {
    const fileName = decamelize(`titres-${domaineId}-${file}`, {
      separator: '-'
    })

    let content
    try {
      content = require(`../../sources/${fileName}.json`)

      return res.concat(content)
    } catch (e) {
      console.info(chalk.red(e.message.split('\n')[0]))
    }

    return res
  }, [])

  return d
}, {})

const seed = seeding(async ({ insert }) => {
  await insert('communes', communes)
  await insert('forets', forets)
  await insert('titres', data.titres)

  await Promise.all([
    insert('titresDemarches', data.titresDemarches),
    insert('titresReferences', data.titresReferences)
  ])

  await Promise.all([
    insert('titresEtapes', data.titresEtapes),
    insert('titresPhases', data.titresPhases),
    insert('titresDemarchesLiens', data.titresDemarchesLiens)
  ])

  await Promise.all([
    insert(
      'titresAdministrationsGestionnaires',
      data.titresAdministrationsGestionnaires
    ),
    insert('titresAdministrationsLocales', data.titresAdministrationsLocales),
    insert('titresAmodiataires', data.titresAmodiataires),
    insert('titresIncertitudes', data.titresIncertitudes),
    insert('titresSubstances', data.titresSubstances),
    insert('titresTitulaires', data.titresTitulaires),
    insert('titresCommunes', data.titresCommunes),
    insert('titresForets', data.titresForets),
    insert('titresPoints', data.titresPoints)
  ])
  await insert('titresPointsReferences', data.titresPointsReferences)
})

module.exports = seed

module.exports.seed = seed
