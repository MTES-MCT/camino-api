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

const titresDemarchesPhases = {
  graph: 'statut'
}

const etapesTypes = {
  graph: `[etapesStatuts]`
}

const demarchesTypes = {
  graph: `[etapesTypes.${etapesTypes.graph}]`
}

const travauxEtapesTypes = {
  graph: `[etapesStatuts]`
}

const travauxTypes = {
  graph: `[travauxEtapesTypes.${travauxEtapesTypes.graph}]`
}

const titresTypes = {
  graph: `[demarchesTypes(orderAsc).${demarchesTypes.graph}, type, titresTypesTitresStatuts]`
}

const documentsRelateTrue = ['type']
const documentsRelateFalse = [] as string[]

const documents = {
  graph: `[type, etapesAssociees]`,
  update: {
    insertMissing: true,
    relate: documentsRelateTrue,
    unrelate: documentsRelateFalse
  }
}

const entreprisesEtablissements = {
  update: { insertMissing: true }
}

const entreprisesRelateTrue = [] as string[]
const entreprisesRelateFalse = [
  ...documentsRelateFalse.map(k => `documents.${k}`)
]

const entreprises = {
  graph: `[utilisateurs.permission, etablissements(orderDesc), documents.${documents.graph}, titresTypes.${titresTypes.graph}]`,
  update: {
    insertMissing: true,
    relate: entreprisesRelateTrue,
    unrelate: entreprisesRelateTrue
  }
}

const utilisateursRelateTrue = ['permission', 'administrations', 'entreprises']

const utilisateursRelateFalse = [
  ...entreprisesRelateFalse.map(k => `entreprises.${k}`)
]

const utilisateurs = {
  graph: `[permission, administrations.[titresTypes, activitesTypes], entreprises.etablissements]`,
  update: {
    relate: utilisateursRelateTrue,
    unrelate: utilisateursRelateTrue,
    noDelete: utilisateursRelateFalse
  }
}

const administrationsRelateTrue = [
  'administrationsTypes',
  'departement',
  'region'
]

const administrations = {
  graph: `[utilisateurs.permission, titresTypes.${titresTypes.graph}, titresTypesTitresStatuts, titresTypesEtapesTypes, type, departement, region]`,
  update: {
    insertMissing: true,
    relate: administrationsRelateTrue,
    unrelate: administrationsRelateTrue
  }
}

const titresEtapesRelateTrue = [
  'type',
  'statut',
  'titulaires',
  'amodiataires',
  'administrations',
  'substances',
  'communes',
  'forets',
  'justificatifs'
]

const titresEtapesRelateFalse = [
  'titulaires.etablissements',
  'titulaires.utilisateurs',
  'titulaires.utilisateurs.permission',
  'titulaires.documents',
  'titulaires.documents.type',
  'amodiataires.etablissements',
  'amodiataires.utilisateurs',
  'amodiataires.utilisateurs.permission',
  'administrations.titresTypes',
  'administrations.type',
  'administrations.utilisateurs',
  'administrations.utilisateurs.permission',
  'substances.legales',
  'points.references.geoSysteme',
  'points.references.geoSysteme.unite',
  ...documentsRelateFalse.map(k => `documents.${k}`),
  ...documentsRelateFalse.map(k => `justificatifs.${k}`)
]

const titresEtapes = {
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
    forets
  ]`,

  update: {
    relate: titresEtapesRelateTrue,
    unrelate: titresEtapesRelateTrue,
    noInsert: titresEtapesRelateFalse,
    noUpdate: titresEtapesRelateFalse,
    noDelete: titresEtapesRelateFalse,
    insertMissing: true
  }
}

const titresTravauxEtapesRelateTrue = ['type', 'statut']

const titreTravauxEtapesRelateFalse = [
  ...documentsRelateFalse.map(k => `documents.${k}`)
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
    noInsert: titreTravauxEtapesRelateFalse,
    noUpdate: titreTravauxEtapesRelateFalse,
    noDelete: titreTravauxEtapesRelateFalse,
    insertMissing: true
  }
}

const titresTypesRelateFalse = [
  'type',
  'demarchesTypes',
  'demarchesTypes.etapesTypes',
  'demarchesTypes.etapesTypes.etapesStatuts',
  'demarchesTypes.etapesTypes',
  'titresTypesTitresStatuts'
]

const titresDemarchesRelateTrue = [
  'statut',
  'type',
  'enfants',
  'parents',
  'phase.statut',
  ...titresEtapesRelateTrue.map(k => `etapes.${k}`)
]

const titresDemarchesRelateFalse = [
  'type.etapesTypes',
  'type.etapesTypes.etapesStatuts',
  'type.etapesTypes',
  'titreType',
  ...titresTypesRelateFalse.map(k => `titreType.${k}`)
]

const titresDemarches = {
  graph: `[
     type.${demarchesTypes.graph},
     statut,
     phase.${titresDemarchesPhases.graph},
     titreType,
     etapes(orderDesc).${titresEtapes.graph},
     parents.^1,
     enfants.^1
  ]`,

  update: {
    relate: titresDemarchesRelateTrue,
    unrelate: titresDemarchesRelateTrue,
    noInsert: titresDemarchesRelateFalse,
    noUpdate: titresDemarchesRelateFalse,
    noDelete: titresDemarchesRelateFalse,
    insertMissing: true
  }
}

const activitesTypesRelateTrue = [
  'pays',
  'frequence',
  'titresTypes',
  'administrations',
  'documentsTypes'
]

const activitesTypesRelateFalse = [
  'frequence.mois',
  'frequence.trimestres',
  'frequence.trimestres.mois',
  'frequence.annees',
  'administrations.type',
  ...titresTypesRelateFalse.map(k => `type.titresTypes.${k}`)
]

const activitesTypes = {
  graph: `[pays, frequence.[mois, trimestres.mois, annees], titresTypes, administrations, documentsTypes]`,

  update: {
    relate: activitesTypesRelateTrue,
    unrelate: activitesTypesRelateTrue,
    noInsert: activitesTypesRelateFalse,
    noUpdate: activitesTypesRelateFalse,
    noDelete: activitesTypesRelateFalse,
    insertMissing: false
  }
}

const titresActivitesRelateTrue = ['type', 'statut', 'utilisateur']

const titresActivitesRelateFalse = [
  ...activitesTypesRelateFalse.map(k => `type.${k}`),
  ...documents.update.relate.map(k => `documents.${k}`)
]

const titresActivites = {
  graph: `[type.${activitesTypes.graph}, statut, utilisateur]`,
  update: {
    relate: titresActivitesRelateTrue,
    unrelate: titresActivitesRelateTrue,
    noInsert: titresActivitesRelateFalse,
    noUpdate: titresActivitesRelateFalse,
    noDelete: titresActivitesRelateFalse,
    insertMissing: true
  }
}

const titresTravauxRelateTrue = [
  'statut',
  'type',
  ...titresTravauxEtapesRelateTrue.map(k => `travauxEtapes.${k}`)
]

const titresTravauxRelateFalse = [] as string[]

const titresTravaux = {
  graph: `[type.${travauxTypes.graph}, statut, 
     travauxEtapes(orderDesc).${titresTravauxEtapes.graph}]`,

  update: {
    relate: titresTravauxRelateTrue,
    unrelate: titresTravauxRelateTrue,
    noInsert: titresTravauxRelateFalse,
    noUpdate: titresTravauxRelateFalse,
    noDelete: titresTravauxRelateFalse,
    insertMissing: true
  }
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
  ...titresActivitesRelateTrue.map(k => `activites.${k}`),
  ...titresDemarchesRelateTrue.map(k => `demarches.${k}`),
  ...titresTravauxRelateTrue.map(k => `travaux.${k}`)
]

const titresRelateFalse = [
  ...titresTypesRelateFalse.map(k => `type.${k}`),
  'domaine.titresTypes',
  ...titresTypesRelateFalse.map(k => `domaine.titresTypes.${k}`),
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
  'forets',
  'substances',
  'substances.legales',
  'substances.legales.code',
  'substances.legales.domaine',
  'substances.legales.fiscales',
  'substances.legales.fiscales.unite',
  'substances.legales.fiscales.unite.referenceUnite',
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
  ...titresActivitesRelateFalse.map(k => `activites.${k}`),
  ...titresDemarchesRelateFalse.map(k => `demarches.${k}`),
  ...titresTravauxRelateFalse.map(k => `travaux.${k}`)
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

  update: {
    relate: titresRelateTrue,
    unrelate: titresRelateTrue,
    noInsert: titresRelateFalse,
    noUpdate: titresRelateFalse,
    noDelete: titresRelateFalse,
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
  titresEtapes,
  titresDemarchesPhases,
  titresTravaux,
  titresTravauxEtapes,
  titresTypes,
  travauxTypes,
  travauxEtapesTypes,
  utilisateurs
}
