const seeding = require('../seeding')

exports.seed = seeding(async ({ del }) => {
  // 11
  await del('globales')

  // 10
  await del('titresActivites')

  // 09
  await Promise.all([
    del('titresSubstances'),
    del('titresPointsReferences'),
    del('titresTitulaires'),
    del('titresCommunes'),
    del('titresAdministrationsGestionnaires'),
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
  await del('titresReferences')
  await del('titresDemarches')
  await del('titres')

  // 08
  await Promise.all([
    del('autorisations__domaines'),
    del('autorisations__titresTypes__titresStatuts'),
    del('autorisations__etapesTypes'),

    del('administrations__titres_types'),
    del('administrations__titres_types__titres_statuts'),
    del('administrations__titres_types__etapes_types')
  ])

  // 07
  await del('activitesTypes__pays')
  await del('titresTypes__activitesTypes')
  await del('activitesTypes__administrations')
  await del('activitesTypes')
  await del('activitesStatuts')

  // 06
  await del('utilisateurs__administrations')
  await del('utilisateurs__entreprises')
  await del('utilisateurs')
  await del('permissions')

  // 05
  await Promise.all([del('entreprisesEtablissements'), del('administrations')])

  await Promise.all([del('entreprises'), del('administrationsTypes')])

  // 04
  await del('substances')
  await del('substances__substancesLegales')
  await del('substancesLegales')
  await del('substancesLegalesCodes')

  // 03
  await Promise.all([
    del('titresTypesTypes'),
    del('titresTypes__demarchesTypes'),
    del('titresTypes__demarchesTypes__etapesTypes'),
    del('etapesTypes__etapesStatuts'),
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
  await del('communes')
  await del('departements')
  await del('regions')
  await del('pays')

  // 01
  await del('mois')
  await del('trimestres')
  await del('annees')
  await del('frequences')
})
