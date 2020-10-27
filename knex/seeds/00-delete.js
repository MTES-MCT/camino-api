const seeding = require('../seeding')

const seed = seeding(async ({ del }) => {
  // 18
  await del('globales')

  // 17
  await del('documents')

  // 16
  await del('titresTravauxEtapes')
  await del('titresTravaux')

  // 15
  await del('titresActivites')

  // 14
  await Promise.all([
    del('titresSubstances'),
    del('titresPointsReferences'),
    del('titresTitulaires'),
    del('titresCommunes'),
    del('titresForets'),
    del('titresAdministrationsGestionnaires'),
    del('titresAdministrationsLocales'),
    del('titresAmodiataires'),
    del('titresIncertitudes'),
    del('titresEtapesJustificatifs'),
    del('communes'),
    del('forets')
  ])
  await del('titresPoints')
  await Promise.all([
    del('titresEtapes'),
    del('titresPhases'),
    del('titresDemarchesLiens')
  ])
  await del('titresReferences')
  await del('titresDemarches')
  await del('titres')

  // 13
  await Promise.all([
    del('travauxTypes__etapesTypes'),
    del('travauxTypes__demarchesStatuts')
  ])
  await del('travauxTypes')

  // 12
  await del('activitesTypes__documentsTypes')
  await del('activitesTypes__pays')
  await del('titresTypes__activitesTypes')
  await del('activitesTypes__administrations')
  await del('activitesTypes')
  await del('activitesStatuts')

  // 11
  await del('utilisateurs__administrations')
  await del('utilisateurs__entreprises')
  await del('utilisateurs')

  // 10
  await del('entreprisesEtablissements')
  await del('entreprises')

  // 05
  await Promise.all([
    del('administrations__titres_types'),
    del('administrations__titres_types__titres_statuts'),
    del('administrations__titres_types__etapes_types')
  ])
  await del('administrations')
  await del('administrationsTypes')

  // 04
  await del('substances')
  await del('substances__substancesLegales')
  await del('substancesLegales')
  await del('substancesLegalesCodes')

  // 03
  await Promise.all([
    del('definitions'),
    del('permissions'),
    del('titresTypesTypes'),
    del('titresTypes__demarchesTypes'),
    del('titresTypes__demarchesTypes__etapesTypes'),
    del('etapesTypes__etapesStatuts'),
    del('titresTypes__titresStatuts'),
    del('geoSystemes')
  ])
  await Promise.all([
    del('titresStatuts'),
    del('devises'),
    del('unites'),
    del('referencesTypes'),
    del('phasesStatuts'),
    del('demarchesTypes'),
    del('etapesTypes'),
    del('demarchesStatuts'),
    del('etapesStatuts'),
    del('documentsTypes'),
    del('titresTypes')
  ])
  await Promise.all([del('domaines'), del('titresTypesTypes')])

  // 02
  await del('departements')
  await del('regions')
  await del('pays')

  // 01
  await del('mois')
  await del('trimestres')
  await del('annees')
  await del('frequences')
})

module.exports = seed

module.exports.seed = seed
