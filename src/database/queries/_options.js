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
  }, emprises, engagementDevise, volumeUnite, communes.${communes.eager}]`,

  update: {
    relate: [
      'type',
      'statut',
      'titulaires',
      'amodiataires',
      'substances',
      'emprises',
      'administrations',
      'communes',
      'engagementDevise',
      'volumeUnite',
      'points.references.geoSysteme'
    ],
    unrelate: [
      'type',
      'statut',
      'titulaires',
      'amodiataires',
      'substances',
      'emprises',
      'administrations',
      'communes',
      'engagementDevise',
      'volumeUnite',
      'points.references.geoSysteme'
    ],
    noInsert: [],
    noUpdate: [],
    noDelete: [],
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
      'type',
      'type.etapesTypes',
      'type.etapesTypes.etapesStatuts',
      'type.demarchesStatuts',
      'statut',
      'annulationDemarche',
      'parents',
      'phase.statut',
      ...etapes.update.relate.map(k => `etapes.${k}`)
    ],
    unrelate: [
      'type',
      'type.etapesTypes',
      'type.etapesTypes.etapesStatuts',
      'type.demarchesStatuts',
      'statut',
      'annulationDemarche',
      'enfants',
      'phase.statut',
      ...etapes.update.unrelate.map(k => `etapes.${k}`)
    ],
    noInsert: [...etapes.update.noInsert.map(k => `etapes.${k}`)],
    noUpdate: [...etapes.update.noUpdate.map(k => `etapes.${k}`)],
    noDelete: [...etapes.update.noDelete.map(k => `etapes.${k}`)],
    insertMissing: true
  }
}

const activitesTypes = {
  eager: `[pays, frequence.[mois, trimestres.mois], types]`
}

const titresActivites = {
  eager: `[type.${activitesTypes.eager}, statut, utilisateur]`
}

const titres = {
  eager: `[type.demarchesTypes.demarchesStatuts, domaine, statut, points, substances.${
    substances.eager
  }, titulaires.${entreprises.eager}, amodiataires.${
    entreprises.eager
  }, administrations.${administrations.eager}, demarches(orderDesc).${
    demarches.eager
  }, surfaceEtape, volumeEtape, volumeUnite, engagementEtape, engagementDevise, communes.${
    communes.eager
  }, activites(orderByDateDesc).${titresActivites.eager}]`,

  update: {
    relate: [
      'type',
      'statut',
      'domaine',
      'engagementDevise',
      ...demarches.update.relate.map(k => `demarches.${k}`)
    ],
    unrelate: [
      'type',
      'statut',
      'domaine',
      'engagementDevise',
      ...demarches.update.unrelate.map(k => `demarches.${k}`)
    ],
    noInsert: [
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
      'volumeEtape',
      'surfaceEtape',
      'engagementEtape',
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
      ...demarches.update.noInsert.map(k => `demarches.${k}`)
    ],
    noUpdate: [
      'points',
      'pays',
      'communes',
      'substances',
      'titulaires',
      'volumeEtape',
      'surfaceEtape',
      'engagementEtape',
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
      ...demarches.update.noUpdate.map(k => `demarches.${k}`)
    ],
    noDelete: [
      'points',
      'pays',
      'communes',
      'substances',
      'titulaires',
      'volumeEtape',
      'surfaceEtape',
      'engagementEtape',
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
      'volumeEtape',
      'surfaceEtape',
      'engagementEtape',
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
  demarchesTypes,
  titresActivites,
  activitesTypes,
  communes
}
