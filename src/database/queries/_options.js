const utilisateurs = {
  eager: '[permission, administration, entreprise.etablissements]',
  update: {
    relate: ['permission', 'administration', 'entreprise'],
    unrelate: ['permission', 'administration', 'entreprise'],
    noDelete: ['permission', 'administration', 'entreprise']
  }
}

const administrations = {
  eager: `utilisateurs.permission`,
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

const points = {
  eager: `references.geoSysteme`
}

const communes = {
  eager: `departement.region.pays`
}

const etapes = {
  eager: `[points.${points.eager}, type, statut, documents, substances.${
    substances.eager
  }, titulaires.${entreprises.eager}, amodiataires.${
    entreprises.eager
  }, administrations.${
    administrations.eager
  }, emprises, engagementDevise, volumeUnite, communes.${
    communes.eager
  }, incertitudes]`,

  update: {
    relate: [
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
      'administrations.utilisateurs',
      'administrations.utilisateurs.permission',
      'substances',
      'substances.legales',
      'emprises',
      'engagementDevise',
      'volumeUnite',
      'points.references.geoSysteme'
    ],
    unrelate: [
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
      'administrations.utilisateurs',
      'administrations.utilisateurs.permission',
      'substances',
      'substances.legales',
      'emprises',
      'engagementDevise',
      'volumeUnite',
      'points.references.geoSysteme'
    ],
    noInsert: [
      'communes',
      'communes.departement',
      'communes.departement.region',
      'communes.departement.region.pays'
    ],
    noUpdate: [
      'communes',
      'communes.departement',
      'communes.departement.region',
      'communes.departement.region.pays'
    ],
    noDelete: [
      'communes',
      'communes.departement',
      'communes.departement.region',
      'communes.departement.region.pays'
    ],
    insertMissing: true
  }
}

const phases = {
  eager: 'statut'
}

const demarchesTypes = {
  eager: `[etapesTypes(orderDesc).etapesStatuts]`
}

const demarches = {
  eager: `[type.${demarchesTypes.eager}, statut, phase.${
    phases.eager
  }, titreType, etapes(orderDesc).${etapes.eager}, parents.^1, enfants.^1]`,

  update: {
    relate: [
      'statut',
      'annulationDemarche',
      'parents',
      'phase.statut',
      ...etapes.update.relate.map(k => `etapes.${k}`)
    ],
    unrelate: [
      'statut',
      'annulationDemarche',
      'enfants',
      'phase.statut',
      ...etapes.update.unrelate.map(k => `etapes.${k}`)
    ],
    noInsert: [
      'type',
      'type.etapesTypes',
      'type.etapesTypes.etapesStatuts',
      'titreType',
      ...etapes.update.noInsert.map(k => `etapes.${k}`)
    ],
    noUpdate: [
      'type',
      'type.etapesTypes',
      'type.etapesTypes.etapesStatuts',
      'titreType',
      ...etapes.update.noUpdate.map(k => `etapes.${k}`)
    ],
    noDelete: [
      'type',
      'type.etapesTypes',
      'type.etapesTypes.etapesStatuts',
      'titreType',
      ...etapes.update.noDelete.map(k => `etapes.${k}`)
    ],
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
  eager: `[demarchesTypes.demarchesStatuts]`
}

const domaines = {
  eager: `[types.${types.eager}]`
}

const titres = {
  eager: `[type.${types.eager}, domaine.${
    domaines.eager
  }, statut, points, substances.${substances.eager}, titulaires.${
    entreprises.eager
  }, amodiataires.${entreprises.eager}, administrations.${
    administrations.eager
  }, demarches(orderDesc).${
    demarches.eager
  }, surfaceEtape, volumeEtape, volumeUnite, engagementEtape, engagementDevise, communes.${
    communes.eager
  }, activites(orderByDateDesc).${titresActivites.eager}]`,

  update: {
    relate: [...demarches.update.relate.map(k => `demarches.${k}`)],
    unrelate: [...demarches.update.unrelate.map(k => `demarches.${k}`)],
    noInsert: [
      'type',
      'type.demarchesTypes',
      'type.demarchesTypes.demarchesStatuts',
      'statut',
      'domaine',
      'domaine.types',
      'domaine.types.demarchesTypes',
      'domaine.types.demarchesTypes.demarchesStatuts',
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
      'administrations',
      'administrations.utilisateurs',
      'administrations.utilisateurs.permission',
      'volumeEtape',
      'volumeUnite',
      'surfaceEtape',
      'engagementEtape',
      'engagementDevise',
      'pointsTitreEtapeId',
      'titulairesTitreEtapeId',
      'amodiatairesTitreEtapeId',
      'administrationsTitreEtapeId',
      'surfaceTitreEtapeId',
      'volumeTitreEtapeId',
      'volumeUniteIdTitreEtapeId',
      'substancesTitreEtapeId',
      'communesTitreEtapeId',
      'engagementTitreEtapeId',
      'engagementDeviseIdTitreEtapeId',
      'activites.type',
      'activites.statut',
      'activites.utilisateur',
      'activites.type.frequence',
      'activites.type.frequence.trimestres',
      'activites.type.frequence.trimestres.mois',
      'activites.type.pays',
      'activites.type.types',
      ...demarches.update.noInsert.map(k => `demarches.${k}`)
    ],
    noUpdate: [
      'domaine.types',
      'domaine.types.demarchesTypes',
      'points',
      'pays',
      'communes',
      'substances',
      'titulaires',
      'titulaires.etablissements',
      'titulaires.utilisateurs',
      'titulaires.utilisateurs.permission',
      'amodiataires',
      'amodiataires.etablissements',
      'amodiataires.utilisateurs',
      'amodiataires.utilisateurs.permission',
      'administrations',
      'administrations.utilisateurs',
      'administrations.utilisateurs.permission',
      'volumeEtape',
      'volumeUnite',
      'surfaceEtape',
      'engagementEtape',
      'engagementDevise',
      'pointsTitreEtapeId',
      'titulairesTitreEtapeId',
      'amodiatairesTitreEtapeId',
      'administrationsTitreEtapeId',
      'surfaceTitreEtapeId',
      'volumeTitreEtapeId',
      'volumeUniteIdTitreEtapeId',
      'substancesTitreEtapeId',
      'communesTitreEtapeId',
      'engagementTitreEtapeId',
      'engagementDeviseIdTitreEtapeId',
      'activites.type',
      'activites.statut',
      'activites.utilisateur',
      'activites.type.frequence',
      'activites.type.frequence.trimestres',
      'activites.type.frequence.trimestres.mois',
      'activites.type.pays',
      'activites.type.types',
      ...demarches.update.noUpdate.map(k => `demarches.${k}`)
    ],
    noDelete: [
      'domaine.types',
      'domaine.types.demarchesTypes',
      'points',
      'pays',
      'communes',
      'substances',
      'titulaires',
      'titulaires.etablissements',
      'titulaires.utilisateurs',
      'titulaires.utilisateurs.permission',
      'amodiataires',
      'amodiataires.etablissements',
      'amodiataires.utilisateurs',
      'amodiataires.utilisateurs.permission',
      'administrations',
      'administrations.utilisateurs',
      'administrations.utilisateurs.permission',
      'volumeEtape',
      'volumeUnite',
      'surfaceEtape',
      'engagementEtape',
      'engagementDevise',
      'pointsTitreEtapeId',
      'titulairesTitreEtapeId',
      'amodiatairesTitreEtapeId',
      'administrationsTitreEtapeId',
      'surfaceTitreEtapeId',
      'volumeTitreEtapeId',
      'volumeUniteIdTitreEtapeId',
      'substancesTitreEtapeId',
      'communesTitreEtapeId',
      'engagementTitreEtapeId',
      'engagementDeviseIdTitreEtapeId',
      'activites.type',
      'activites.statut',
      'activites.utilisateur',
      'activites.type.frequence',
      'activites.type.frequence.trimestres',
      'activites.type.frequence.trimestres.mois',
      'activites.type.pays',
      'activites.type.types',
      ...demarches.update.noDelete.map(k => `demarches.${k}`)
    ],
    insertMissing: true
  }
}

export default {
  utilisateurs,
  phases,
  etapes,
  demarches,
  titres,
  substances,
  administrations,
  entreprises,
  entreprisesEtablissements,
  domaines,
  demarchesTypes,
  titresActivites,
  activitesTypes,
  communes
}
