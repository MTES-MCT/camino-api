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
  }, titresSubstances, titresTitulaires, titresAmodiataires, titresAdministrations, titresEmprises]`,
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
    noInsert: [
      'titresSubstances',
      'titresTitulaires',
      'titresAmodiataires',
      'titresAdministrations',
      'titresEmprises'
    ],
    noUpdate: [
      'titresSubstances',
      'titresTitulaires',
      'titresAmodiataires',
      'titresAdministrations',
      'titresEmprises'
    ],
    noDelete: [
      'titresSubstances',
      'titresTitulaires',
      'titresAmodiataires',
      'titresAdministrations',
      'titresEmprises'
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
  }, etapes(orderDesc).${etapes.eager}, parents.^1, enfants.^1]`,
  update: {
    relate: [
      'type',
      'type.etapesTypes',
      'type.etapesTypes.etapesStatuts',
      'type.demarchesStatuts',
      'statut',
      'annulationDemarche',
      'parents',
      ...etapes.update.relate.map(k => `etapes.${k}`),
      'phase.statut'
    ],
    unrelate: [
      'type',
      'type.etapesTypes',
      'type.etapesTypes.etapesStatuts',
      'type.demarchesStatuts',
      'statut',
      'annulationDemarche',
      'enfants',
      ...etapes.update.unrelate.map(k => `etapes.${k}`),
      'phase.statut'
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
    relate: ['type', 'domaine', 'statut', 'substances'],
    unrelate: ['type', 'domaine', 'statut', 'substances'],
    insertMissing: ['phases', 'phases.points']
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
