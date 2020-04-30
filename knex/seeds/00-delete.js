const seeding = require('../seeding')

exports.seed = seeding(async ({ del }) => {
  // 12
  await del('globales')

  // 11
  await del('titresActivites')

  // 10
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

  // 09
  await Promise.all([
    del('a__titresTypes__titresStatuts'),
    del('a__etapesTypes'),

    del('a__titres_types__administrations'),
    del('r__titres_types__titres_statuts__administrations'),
    del('r__titres_types__etapes_types__administrations')
  ])

  // 08
  await del('activitesTypes__pays')
  await del('titresTypes__activitesTypes')
  await del('activitesTypes__administrations')
  await del('activitesTypes')
  await del('activitesStatuts')

  // 07
  await del('utilisateurs__administrations')
  await del('utilisateurs__entreprises')
  await del('utilisateurs')

  // 06
  await del('entreprisesEtablissements')
  await del('entreprises')

  // 05
  await del('administrations')
  await del('administrationsTypes')

  // 04
  await del('substances')
  await del('substances__substancesLegales')
  await del('substancesLegales')
  await del('substancesLegalesCodes')

  // 03
  await Promise.all([
    del('permissions'),
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
