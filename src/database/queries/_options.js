const utilisateurs = {
  graph: '[permission, administrations.[domaines], entreprises.etablissements]',
  update: {
    relate: ['permission', 'administrations', 'entreprises'],
    unrelate: ['permission', 'administrations', 'entreprises'],
    noDelete: ['permission', 'administrations', 'entreprises']
  }
}

const administrations = {
  graph: `[utilisateurs.permission, domaines, type]`,
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
  graph: `[utilisateurs.permission, etablissements(orderDesc)]`,
  update: {
    insertMissing: true,
    relate: false,
    unrelate: false
  }
}

const substances = {
  graph: `legales.[code, domaine]`
}

const geoSystemes = {
  graph: `unite`
}

const points = {
  graph: `references.geoSysteme.${geoSystemes.graph}`
}

const communes = {
  graph: `departement.region.pays`
}

const pays = {
  graph: `regions.departements.communes`
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
  'points.references.geoSysteme.unite',
  'communes',
  'communes.departement',
  'communes.departement.region',
  'communes.departement.region.pays'
]

const etapes = {
  graph: `[
    points(orderAsc).${points.graph},
    type,
    statut,
    documents,
    substances(orderAsc).${substances.graph},
    titulaires.${entreprises.graph},
    amodiataires.${entreprises.graph},
    administrations.${administrations.graph},
    engagementDevise,
    volumeUnite,
    communes.${communes.graph},
    incertitudes
  ]`,

  update: {
    relate: etapesUpdateTrue,
    unrelate: etapesUpdateTrue,
    insertMissing: true
  }
}

const phases = {
  graph: 'statut'
}

const demarchesTypes = {
  graph: `[etapesTypes.etapesStatuts]`
}

const demarchesUpdateTrue = [
  'statut',
  'type',
  'annulationDemarche',
  'enfants',
  'parents',
  'phase.statut',
  ...etapesUpdateTrue.map(k => `etapes.${k}`)
]

const demarchesUpdateFalse = [
  'type.etapesTypes',
  'type.etapesTypes.etapesStatuts',
  'titreType'
]

const demarches = {
  graph: `[
     type.${demarchesTypes.graph},
     statut,
     phase.${phases.graph},
     titreType,
     etapes(orderDesc).${etapes.graph},
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
  graph: `[pays, frequence.[mois, trimestres.mois, annees], types]`
}

const titresActivites = {
  graph: `[type.${activitesTypes.graph}, statut, utilisateur, titre.[titulaires, amodiataires]]`
}

const types = {
  graph: `[demarchesTypes(orderAsc).${demarchesTypes.graph}]`
}

const domaines = {
  graph: `[types(orderAsc).${types.graph}]`
}

const titresUpdateTrue = [
  'type',
  'statut',
  'domaine',
  'administrationsGestionnaires',
  ...demarchesUpdateTrue.map(k => `demarches.${k}`)
]

const titresUpdateFalse = [
  'type.demarchesTypes',
  'type.demarchesTypes.etapesTypes',
  'type.demarchesTypes.etapesTypes.etapesStatuts',
  'domaine.types',
  'domaine.types.demarchesTypes',
  'domaine.types.demarchesTypes.etapesTypes',
  'domaine.types.demarchesTypes.etapesTypes.etapesStatuts',
  'points',
  'points.references',
  'points.references.geoSysteme',
  'points.references.geoSysteme.unite',
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
  'administrationsGestionnaires.domaines',
  'administrationsGestionnaires.type',
  'administrationsGestionnaires.utilisateurs',
  'administrationsGestionnaires.utilisateurs.permission',
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
  graph: `[
    type.${types.graph},
    domaine.${domaines.graph},
    statut,
    points(orderAsc).${points.graph},
    substances(orderAsc).${substances.graph},
    titulaires.${entreprises.graph},
    amodiataires.${entreprises.graph},
    administrationsGestionnaires.${administrations.graph},
    administrationsLocales.${administrations.graph},
    demarches(orderDesc).${demarches.graph},
    surfaceEtape,
    volumeEtape,
    volumeUnite,
    engagementEtape,
    engagementDevise,
    communes.${communes.graph},
    activites(orderDesc).${titresActivites.graph},
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
