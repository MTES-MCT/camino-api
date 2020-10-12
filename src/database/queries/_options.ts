const documents = {
  graph: `[type, etapesAssociees]`,
  update: {
    insertMissing: true,
    relate: ['type'],
    unrelate: ['type']
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
  graph: `[utilisateurs.permission, etablissements(orderDesc), documents.${documents.graph}]`,
  update: {
    insertMissing: true,
    relate: [...documents.update.relate.map(k => `documents.${k}`)],
    unrelate: [...documents.update.unrelate.map(k => `documents.${k}`)]
  }
}

const utilisateurs = {
  graph: `[permission, administrations.[titresTypes, activitesTypes], entreprises.etablissements]`,
  update: {
    relate: [
      'permission',
      'administrations',
      'entreprises',
      ...entreprises.update.relate.map(k => `entreprises.${k}`)
    ],
    unrelate: [
      'permission',
      'administrations',
      'entreprises',
      ...entreprises.update.unrelate.map(k => `entreprises.${k}`)
    ],
    noDelete: [
      'permission',
      'administrations',
      'entreprises',
      ...entreprises.update.relate
    ]
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

const titresDemarchesEtapesRelateTrue = [
  'type',
  'statut',
  'titulaires',
  'titulaires.etablissements',
  'titulaires.utilisateurs',
  'titulaires.utilisateurs.permission',
  'titulaires.documents',
  'titulaires.documents.type',
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
  'points.references.geoSysteme',
  'points.references.geoSysteme.unite',
  'communes',
  'communes.departement',
  'communes.departement.region',
  'communes.departement.region.pays',
  ...documents.update.relate.map(k => `documents.${k}`),
  'justificatifs',
  ...documents.update.relate.map(k => `justificatifs.${k}`)
]

const titresDemarchesEtapes = {
  graph: `[
    points(orderAsc).${points.graph},
    type,
    statut,
    documents.${documents.graph},
    justificatifs.${documents.graph},
    substances(orderAsc).${substances.graph},
    titulaires.${entreprises.graph},
    amodiataires.${entreprises.graph},
    administrations.${administrations.graph},
    communes.${communes.graph},
    incertitudes
  ]`,

  update: {
    relate: titresDemarchesEtapesRelateTrue,
    unrelate: titresDemarchesEtapesRelateTrue,
    insertMissing: true
  }
}

const titresTravauxEtapesRelateTrue = [
  'type',
  'statut',
  ...documents.update.relate.map(k => `documents.${k}`)
]

const titresTravauxEtapes = {
  graph: `[
    type,
    statut,
    documents.${documents.graph}
  ]`,

  update: {
    relate: titresTravauxEtapesRelateTrue,
    unrelate: titresTravauxEtapesRelateTrue,
    insertMissing: true
  }
}

const titresDemarchesPhases = {
  graph: 'statut'
}

const etapesTypes = {
  graph: `[etapesStatuts, autorisations]`
}

const demarchesTypes = {
  graph: `[etapesTypes.${etapesTypes.graph}]`
}

const travauxTypes = {
  graph: `[etapesTypes.${etapesTypes.graph}]`
}

const titresTypesUpdateFalse = [
  'type',
  'demarchesTypes',
  'demarchesTypes.etapesTypes',
  'demarchesTypes.etapesTypes.etapesStatuts',
  'demarchesTypes.etapesTypes.autorisations',
  'autorisationsTitresStatuts'
]

const titresDemarchesRelateTrue = [
  'statut',
  'type',
  'enfants',
  'parents',
  'phase.statut',
  ...titresDemarchesEtapesRelateTrue.map(k => `etapes.${k}`)
]

const titresDemarchesUpdateFalse = [
  ...titresDemarchesRelateTrue,
  'type.etapesTypes',
  'type.etapesTypes.etapesStatuts',
  'type.etapesTypes.autorisations',
  'titreType',
  ...titresTypesUpdateFalse.map(k => `titreType.${k}`)
]

const titresDemarches = {
  graph: `[
     type.${demarchesTypes.graph},
     statut,
     phase.${titresDemarchesPhases.graph},
     titreType,
     etapes(orderDesc).${titresDemarchesEtapes.graph},
     parents.^1,
     enfants.^1
  ]`,

  update: {
    relate: titresDemarchesRelateTrue,
    unrelate: titresDemarchesRelateTrue,
    noInsert: titresDemarchesUpdateFalse,
    noUpdate: titresDemarchesUpdateFalse,
    noDelete: titresDemarchesUpdateFalse,
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
  'type.administrations.type',
  ...documents.update.relate.map(k => `documents.${k}`)
]

const activitesTypes = {
  graph: `[pays, frequence.[mois, trimestres.mois, annees], titresTypes, administrations]`
}

const titresActivites = {
  graph: `[type.${activitesTypes.graph}, statut, utilisateur]`
}

const titresTravauxRelateTrue = [
  'statut',
  'type',
  ...titresTravauxEtapesRelateTrue.map(k => `etapes.${k}`)
]

const titresTravauxUpdateFalse = [...titresTravauxRelateTrue]

const titresTravaux = {
  graph: `[type.${travauxTypes.graph}, statut, 
     etapes(orderDesc).${titresTravauxEtapes.graph}]`,

  update: {
    relate: titresTravauxRelateTrue,
    unrelate: titresTravauxRelateTrue,
    noInsert: titresTravauxUpdateFalse,
    noUpdate: titresTravauxUpdateFalse,
    noDelete: titresTravauxUpdateFalse,
    insertMissing: true
  }
}

const titresTypes = {
  graph: `[demarchesTypes(orderAsc).${demarchesTypes.graph}, type, autorisationsTitresStatuts]`
}

const domaines = {
  graph: `[titresTypes(orderAsc).${titresTypes.graph}]`
}

const titresRelateTrue = [
  'type',
  'statut',
  'domaine',
  'administrationsGestionnaires',
  'references.type',
  ...titresDemarchesRelateTrue.map(k => `demarches.${k}`),
  ...titresTravauxRelateTrue.map(k => `travaux.${k}`)
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
  'titulaires.documents',
  'titulaires.documents.type',
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
  'titulaires.documents',
  'titulaires.documents.type',
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
  'titulaires.documents',
  'titulaires.documents.type',
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
  'titulaires.documents',
  'titulaires.documents.type',
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
  'titulaires.documents',
  'titulaires.documents.type',
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
  'titulaires.documents',
  'titulaires.documents.type',
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
  'titulaires.documents',
  'titulaires.documents.type',
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
  'titulaires.documents',
  'titulaires.documents.type',
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
  'surfaceEtape',
  ...activitesUpdateFalse.map(k => `activites.${k}`),
  ...titresDemarchesUpdateFalse.map(k => `demarches.${k}`),
  ...titresTravauxUpdateFalse.map(k => `travaux.${k}`)
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
    demarches(orderDesc).${titresDemarches.graph},
    communes.${communes.graph},
    forets,
    activites(orderDesc).${titresActivites.graph},
    travaux(orderDesc).${titresTravaux.graph},
    references(orderAsc).type
   ]`,
  // ne pas récupèrer la relation `surfaceEtape`
  // car dans le cas d'une mise à jour d'id
  // cette relation écrase `surfaceTitreEtapeId` contenu dans le titre mis à jour

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
  demarchesTypes,
  domaines,
  documents,
  entreprises,
  entreprisesEtablissements,
  etapesTypes,
  geoSystemes,
  pays,
  points,
  substances,
  titres,
  titresActivites,
  titresDemarches,
  titresDemarchesEtapes,
  titresDemarchesPhases,
  titresTravaux,
  titresTravauxEtapes,
  titresTypes,
  utilisateurs
}
