const utilisateurs = {
  eager: '[permission, administration, entreprise]',
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
  eager: `utilisateurs.permission`
}

const substances = {
  eager: `legales.[code, domaine]`
}

const points = {
  eager: `references`
}

const etapes = {
  eager: `[points.${points.eager}, type, statut, documents, substances.${
    substances.eager
  }, titresSubstances, titulaires.${
    entreprises.eager
  }, titresTitulaires, amodiataires.${
    entreprises.eager
  }, titresAmodiataires, administrations.${
    administrations.eager
  }, titresAdministrations, emprises, titresEmprises]`,
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
  }]`
}

const titres = {
  eager: `[type, domaine, statut, points, substances.${
    substances.eager
  }, titulaires.${entreprises.eager}, amodiataires.${
    entreprises.eager
  }, administrations.${administrations.eager}, demarches(orderDesc).${
    demarches.eager
  }, surfaceEtape, volumeEtape, travauxRapports]`,
  update: {
    relate: ['type', 'domaine', 'statut', 'substances'],
    unrelate: ['type', 'domaine', 'statut', 'substances'],
    insertMissing: ['phases', 'phases.points']
  }
}

const demarchesTypes = {
  eager: `etapesTypes.etapesStatuts`
}

module.exports = {
  utilisateurs,
  phases,
  etapes,
  demarches,
  titres,
  substances,
  entreprises,
  demarchesTypes
}
