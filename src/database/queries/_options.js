const utilisateurs = {
  eager: '[permission, administrations, entreprises.etablissements]',
  update: {
    relate: ['permission', 'administrations', 'entreprises'],
    unrelate: ['permission', 'administrations', 'entreprises'],
    noDelete: ['permission', 'administrations', 'entreprises']
  }
}

const administrations = {
  eager: `[utilisateurs.permission, domaines, type]`,
  update: {
    insertMissing: true,
    relate: ['administrationsTypes'],
    unrelate: ['administrationsTypes']
  }
}

const entreprisesEtablissements = {
  update: {
    insertMissing: true
  }
}

const entreprises = {
  eager: `[utilisateurs.permission, etablissements(orderDesc)]`,
  update: {
    insertMissing: true,
    relate: false,
    unrelate: false
  }
}

const substances = {
  eager: `legales.[code, domaine]`
}

const geoSystemes = {
  eager: `unite`
}

const points = {
  eager: `references.geoSysteme.${geoSystemes.eager}`
}

const communes = {
  eager: `departement.region.pays`
}

const pays = {
  eager: `regions.departements.communes`
}

const etapesUpdateTrue = [
  'type',
  'statut',
  'titulaires',
  'titulaires.etablissements',
  'titulaires.utilisateurs',
  'titulaires.utilisateurs.permission',
  'amodiataires',
  'amodiataires.etablissements',
  'amodiataires.utilisateurs',
  'amodiataires.utilisateurs.permission',
  'administrations',
  'administrations.domaines',
  'administrations.type',
  'administrations.utilisateurs',
  'administrations.utilisateurs.permission',
  'substances',
  'substances.legales',
  'engagementDevise',
  'volumeUnite',
  'points.references.geoSysteme',
  'communes',
  'communes.departement',
  'communes.departement.region',
  'communes.departement.region.pays'
]

const etapes = {
  eager: `[
    points(orderAsc).${points.eager},
    type,
    statut,
    documents,
    substances(orderAsc).${substances.eager},
    titulaires.${entreprises.eager},
    amodiataires.${entreprises.eager},
    administrations.${administrations.eager},
    engagementDevise,
    volumeUnite,
    communes.${communes.eager},
    incertitudes
  ]`,

  update: {
    relate: etapesUpdateTrue,
    unrelate: etapesUpdateTrue,
    insertMissing: true
  }
}

const phases = {
  eager: 'statut'
}

const demarchesTypes = {
  eager: `[etapesTypes(orderDesc).etapesStatuts]`
}

const demarchesUpdateTrue = [
  'statut',
  'annulationDemarche',
  'enfants',
  'parents',
  'phase.statut',
  ...etapesUpdateTrue.map(k => `etapes.${k}`)
]

const demarchesUpdateFalse = [
  'type',
  'type.etapesTypes',
  'type.etapesTypes.etapesStatuts',
  'titreType'
]

const demarches = {
  eager: `[
     type.${demarchesTypes.eager},
     statut,
     phase.${phases.eager},
     titreType,
     etapes(orderDesc).${etapes.eager},
     parents.^1,
     enfants.^1
  ]`,

  update: {
    relate: demarchesUpdateTrue,
    unrelate: demarchesUpdateTrue,
    noInsert: demarchesUpdateFalse,
    noUpdate: demarchesUpdateFalse,
    noDelete: demarchesUpdateFalse,
    insertMissing: true
  }
}

const activitesTypes = {
  eager: `[pays, frequence.[mois, trimestres.mois], types]`
}

const titresActivites = {
  eager: `[type.${activitesTypes.eager}, statut, utilisateur]`
}

const types = {
  eager: `[demarchesTypes.${demarchesTypes.eager}]`
}

const domaines = {
  eager: `[types.${types.eager}]`
}

const titresUpdateTrue = [
  'type',
  'statut',
  'domaine',
  ...demarchesUpdateTrue.map(k => `demarches.${k}`)
]

const titresUpdateFalse = [
  'type',
  'type.demarchesTypes',
  'type.demarchesTypes.etapesTypes',
  'type.demarchesTypes.etapesTypes.etapesStatuts',
  'domaine.types',
  'domaine.types.demarchesTypes',
  'domaine.types.demarchesTypes.etapesTypes',
  'domaine.types.demarchesTypes.etapesTypes.etapesStatuts',
  'points',
  'pays',
  'pays.departement',
  'pays.departement.region',
  'communes',
  'communes.departement',
  'communes.departement.region',
  'communes.departement.region.pays',
  'substances',
  'substances.legales',
  'substances.legales.code',
  'substances.legales.domaine',
  'titulaires',
  'titulaires.etablissements',
  'titulaires.utilisateurs',
  'titulaires.utilisateurs.permission',
  'amodiataires',
  'amodiataires.etablissements',
  'amodiataires.utilisateurs',
  'amodiataires.utilisateurs.permission',
  'administrationsCentrales',
  'administrationsCentrales.domaines',
  'administrationsCentrales.type',
  'administrationsCentrales.utilisateurs',
  'administrationsCentrales.utilisateurs.permission',
  'administrationsLocales',
  'administrationsLocales.domaines',
  'administrationsLocales.type',
  'administrationsLocales.utilisateurs',
  'administrationsLocales.utilisateurs.permission',
  'volumeEtape',
  'engagementEtape',
  'surfaceEtape',
  'volumeUnite',
  'engagementDevise',
  'activites.type',
  'activites.statut',
  'activites.utilisateur',
  'activites.type.frequence',
  'activites.type.frequence.trimestres',
  'activites.type.frequence.trimestres.mois',
  'activites.type.pays',
  'activites.type.types',
  ...demarchesUpdateFalse.map(k => `demarches.${k}`)
]

const titres = {
  eager: `[
    type.${types.eager},
    domaine.${domaines.eager},
    statut,
    points(orderAsc),
    substances(orderAsc).${substances.eager},
    titulaires.${entreprises.eager},
    amodiataires.${entreprises.eager},
    administrationsCentrales.${administrations.eager},
    administrationsLocales.${administrations.eager},
    demarches(orderDesc).${demarches.eager},
    surfaceEtape,
    volumeEtape,
    volumeUnite,
    engagementEtape,
    engagementDevise,
    communes.${communes.eager},
    activites(orderDesc).${titresActivites.eager},
    references(orderAsc)
  ]`,

  update: {
    relate: titresUpdateTrue,
    unrelate: titresUpdateTrue,
    noInsert: titresUpdateFalse,
    noUpdate: titresUpdateFalse,
    noDelete: titresUpdateFalse,
    insertMissing: true
  }
}

export default {
  activitesTypes,
  administrations,
  communes,
  demarches,
  entreprises,
  entreprisesEtablissements,
  etapes,
  demarchesTypes,
  domaines,
  geoSystemes,
  phases,
  substances,
  titres,
  titresActivites,
  pays,
  points,
  utilisateurs,
  types
}
