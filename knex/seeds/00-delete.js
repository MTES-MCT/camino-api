const seeding = require('../seeding')

exports.seed = seeding(async ({ del, insert }) => {
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
    del('restrictions__domaines'),
    del('restrictions__types__administrations'),
    del('restrictions__types__statuts'),
    del('restrictions__types__statuts__administrations'),
    del('restrictions__etapesTypes'),
    del('restrictions__etapesTypes__administrations')
  ])

  // 07
  await del('activitesTypes__pays')
  await del('activitesTypes__types')
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

  await Promise.all([
    del('entreprises'),
    del('administrationsTypes'),
    del('administrations__domaines')
  ])

  // 04
  await del('substances')
  await del('substances__substancesLegales')
  await del('substancesLegales')
  await del('substancesLegalesCodes')

  // 03
  await Promise.all([
    del('domaines__types'),
    del('demarchesTypes__types'),
    del('demarchesTypes__etapesTypes'),
    del('etapesTypes__etapesStatuts'),
    del('geoSystemes')
  ])
  await Promise.all([
    del('statuts'),
    del('devises'),
    del('unites'),
    del('referencesTypes'),
    del('phasesStatuts'),
    del('demarchesTypes'),
    del('etapesTypes'),
    del('demarchesStatuts'),
    del('etapesStatuts'),
    del('documentsTypes')
  ])
  await Promise.all([del('domaines'), del('types')])

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
