const utilisateurs = {
  eager: '[permission, administration, entreprises.etablissements]',
  update: {
    relate: ['permission', 'administration', 'entreprises'],
    unrelate: ['permission', 'administration', 'entreprises'],
    noDelete: ['permission', 'administration', 'entreprises']
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

const points = {
  eager: `references.geoSysteme`
}

const communes = {
  eager: `departement.region.pays`
}

const etapes = {
  eager: `[points.${points.eager}, type, statut, documents, substances.${substances.eager}, titulaires.${entreprises.eager}, amodiataires.${entreprises.eager}, administrations.${administrations.eager}, emprises, engagementDevise, volumeUnite, communes.${communes.eager}, incertitudes]`,

  update: {
    relate: [
      'type',
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
      'emprises',
      'engagementDevise',
      'volumeUnite',
      'points.references.geoSysteme',
      'communes',
      'communes.departement',
      'communes.departement.region',
      'communes.departement.region.pays'
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
      'administrations.domaines',
      'administrations.type',
      'administrations.utilisateurs',
      'administrations.utilisateurs.permission',
      'substances',
      'substances.legales',
      'emprises',
      'engagementDevise',
      'volumeUnite',
      'points.references.geoSysteme',
      'communes',
      'communes.departement',
      'communes.departement.region',
      'communes.departement.region.pays'
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
  eager: `[type.${demarchesTypes.eager}, statut, phase.${phases.eager}, titreType, etapes(orderDesc).${etapes.eager}, parents.^1, enfants.^1]`,

  update: {
    relate: [
      'statut',
      'annulationDemarche',
      'enfants',
      'parents',
      'phase.statut',
      ...etapes.update.relate.map(k => `etapes.${k}`)
    ],
    unrelate: [
      'statut',
      'annulationDemarche',
      'enfants',
      'parents',
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
  eager: `[demarchesTypes]`
}

const domaines = {
  eager: `[types.${types.eager}]`
}

const titres = {
  eager: `[type.${types.eager}, domaine.${domaines.eager}, statut, points, substances.${substances.eager}, titulaires.${entreprises.eager}, amodiataires.${entreprises.eager}, administrations.${administrations.eager}, demarches(orderDesc).${demarches.eager}, surfaceEtape, volumeEtape, volumeUnite, engagementEtape, engagementDevise, communes.${communes.eager}, activites(orderDesc).${titresActivites.eager}]`,

  update: {
    relate: [
      'type',
      'statut',
      'domaine',
      ...demarches.update.relate.map(k => `demarches.${k}`)
    ],
    unrelate: [
      'type',
      'statut',
      'domaine',
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
      ...demarches.update.noInsert.map(k => `demarches.${k}`)
    ],
    noUpdate: [
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
      'administrations.domaines',
      'administrations.type',
      'administrations.utilisateurs',
      'administrations.utilisateurs.permission',
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
      ...demarches.update.noUpdate.map(k => `demarches.${k}`)
    ],
    noDelete: [
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
      'administrations.domaines',
      'administrations.type',
      'administrations.utilisateurs',
      'administrations.utilisateurs.permission',
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
