const utilisateurs = {
  eager: 'groupes'
}

const administrations = {
  eager: `utilisateurs.${utilisateurs.eager}`
}

const entreprises = {
  eager: `utilisateurs.${utilisateurs.eager}`
}

const substances = {
  eager: `legal.[code, domaine]`
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
  }, titresAdministrations, emprises, titresEmprises]`
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
  eager: `[type, domaine, statut, demarches(orderDesc).${demarches.eager}]`,
  update: {
    relate: ['type', 'domaine', 'statut', 'substances'],
    unrelate: ['type', 'domaine', 'statut', 'substances'],
    insertMissing: ['phases', 'phases.points']
  }
}

const options = {
  utilisateurs,
  phases,
  etapes,
  demarches,
  titres
}

module.exports = options
