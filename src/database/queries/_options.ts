const utilisateurs = {
  graph:
    '[permission, administrations.[titresTypes], entreprises.etablissements]',
  update: {
    relate: ['permission', 'administrations', 'entreprises'],
    unrelate: ['permission', 'administrations', 'entreprises'],
    noDelete: ['permission', 'administrations', 'entreprises']
  }
}

const administrations = {
  graph: `[utilisateurs.permission, titresTypes, type]`,
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

const etapesRelateTrue = [
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
  'administrations.titresTypes',
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
    relate: etapesRelateTrue,
    unrelate: etapesRelateTrue,
    insertMissing: true
  }
}

const phases = {
  graph: 'statut'
}

const demarchesTypes = {
  graph: `[etapesTypes.etapesStatuts]`
}

const demarchesRelateTrue = [
  'statut',
  'type',
  'annulationDemarche',
  'enfants',
  'parents',
  'phase.statut',
  ...etapesRelateTrue.map(k => `etapes.${k}`)
]

const titresTypesUpdateFalse = [
  'type',
  'demarchesTypes',
  'demarchesTypes.etapesTypes',
  'demarchesTypes.etapesTypes.etapesStatuts'
]

const demarchesUpdateFalse = [
  ...demarchesRelateTrue,
  'type.etapesTypes',
  'type.etapesTypes.etapesStatuts',
  'titreType',
  ...titresTypesUpdateFalse.map(k => `titreType.${k}`)
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
    relate: demarchesRelateTrue,
    unrelate: demarchesRelateTrue,
    noInsert: demarchesUpdateFalse,
    noUpdate: demarchesUpdateFalse,
    noDelete: demarchesUpdateFalse,
    insertMissing: true
  }
}

const activitesUpdateFalse = [
  'type',
  'statut',
  'utilisateur',
  'type.frequence',
  'type.frequence.trimestres',
  'type.frequence.trimestres.mois',
  'type.frequence.annees',
  'type.pays',
  'type.titresTypes',
  ...titresTypesUpdateFalse.map(k => `type.titresTypes.${k}`),
  'type.administrations',
  'type.administrations.type'
]

const activitesTypes = {
  graph: `[pays, frequence.[mois, trimestres.mois, annees], titresTypes, administrations]`
}

const titresActivites = {
  graph: `[type.${activitesTypes.graph}, statut, utilisateur]`
}

const titresTypes = {
  graph: `[demarchesTypes(orderAsc).${demarchesTypes.graph}, type]`
}

const domaines = {
  graph: `[titresTypes(orderAsc).${titresTypes.graph}]`
}

const titresRelateTrue = [
  'type',
  'statut',
  'domaine',
  'administrationsGestionnaires',
  ...demarchesRelateTrue.map(k => `demarches.${k}`)
]

const titresUpdateFalse = [
  ...titresRelateTrue,
  ...titresTypesUpdateFalse.map(k => `type.${k}`),
  'domaine.titresTypes',
  ...titresTypesUpdateFalse.map(k => `domaine.titresTypes.${k}`),
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
  'administrationsGestionnaires.titresTypes',
  'administrationsGestionnaires.type',
  'administrationsGestionnaires.utilisateurs',
  'administrationsGestionnaires.utilisateurs.permission',
  'administrationsLocales',
  'administrationsLocales.titresTypes',
  'administrationsLocales.type',
  'administrationsLocales.utilisateurs',
  'administrationsLocales.utilisateurs.permission',
  'volumeEtape',
  'engagementEtape',
  'surfaceEtape',
  'volumeUnite',
  'engagementDevise',
  ...activitesUpdateFalse.map(k => `activites.${k}`),
  ...demarchesUpdateFalse.map(k => `demarches.${k}`)
]

const titres = {
  graph: `[
    type.${titresTypes.graph},
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
    relate: titresRelateTrue,
    unrelate: titresRelateTrue,
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
  titresTypes
}
