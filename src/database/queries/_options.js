const utilisateurs = {
  eager: '[permission, administration, entreprise.etablissements]',
  update: {
    relate: ['permission', 'administration', 'entreprise'],
    unrelate: ['permission', 'administration', 'entreprise'],
    noDelete: ['permission', 'administration', 'entreprise']
  }
}

const administrations = {
  eager: `utilisateurs.permission`
}

const entreprises = {
  eager: `[utilisateurs.permission, etablissements]`,
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
      'administrations'
    ],
    unrelate: [
      'type',
      'statut',
      'titulaires',
      'amodiataires',
      'substances',
      'emprises',
      'administrations'
    ],
    noDelete: []
  }
}

const phases = {
  eager: 'statut'
}

const demarches = {
  eager: `[type, statut, phase.${phases.eager}, etapes(orderDesc).${
    etapes.eager
  }, parents.^1, enfants.^1]`
}

const demarchesTypes = {
  eager: `etapesTypes.etapesStatuts`
}

const activitesTypes = {
  eager: `[pays, frequence.[mois, trimestres.mois], types]`
}

const titresActivites = {
  eager: `[type.${activitesTypes.eager}, statut, utilisateur]`
}

const titres = {
  eager: `[type, domaine, statut, points, substances.${
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
  entreprises,
  demarchesTypes,
  titresActivites,
  activitesTypes,
  communes
}
