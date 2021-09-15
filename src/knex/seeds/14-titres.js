const communes = require('../../../sources/communes.json')
const forets = require('../../../sources/forets.json')
const titres = require('../../../sources/titres.json')
const titresAdministrationsGestionnaires = require('../../../sources/titres-administrations-gestionnaires.json')
const titresAdministrationsLocales = require('../../../sources/titres-administrations-locales.json')
const titresAmodiataires = require('../../../sources/titres-amodiataires.json')
const titresCommunes = require('../../../sources/titres-communes.json')
const titresDemarches = require('../../../sources/titres-demarches.json')
const titresDemarchesLiens = require('../../../sources/titres-demarches-liens.json')
const titresEtapes = require('../../../sources/titres-etapes.json')
const titresForets = require('../../../sources/titres-forets.json')
const titresPhases = require('../../../sources/titres-phases.json')
const titresPoints = require('../../../sources/titres-points.json')
const titresPointsReferences = require('../../../sources/titres-points-references.json')
const titresReferences = require('../../../sources/titres-references.json')
const titresSubstances = require('../../../sources/titres-substances.json')
const titresTitulaires = require('../../../sources/titres-titulaires.json')

const seeding = require('../seeding')

const seed = seeding(async ({ insert }) => {
  await insert('communes', communes)
  await insert('forets', forets)
  await insert('titres', titres)

  await Promise.all([
    insert('titresDemarches', titresDemarches),
    insert('titresReferences', titresReferences)
  ])

  await Promise.all([
    insert('titresEtapes', titresEtapes),
    insert('titresPhases', titresPhases),
    insert('titresDemarchesLiens', titresDemarchesLiens)
  ])

  await Promise.all([
    insert(
      'titresAdministrationsGestionnaires',
      titresAdministrationsGestionnaires
    ),
    insert('titresAdministrationsLocales', titresAdministrationsLocales),
    insert('titresAmodiataires', titresAmodiataires),
    insert('titresSubstances', titresSubstances),
    insert('titresTitulaires', titresTitulaires),
    insert('titresCommunes', titresCommunes),
    insert('titresForets', titresForets),
    insert('titresPoints', titresPoints)
  ])
  await insert('titresPointsReferences', titresPointsReferences)
})

module.exports = seed

module.exports.seed = seed
