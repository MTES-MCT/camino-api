const utilisateurs = {
  eager: '[groupes]'
}

const etapes = {
  eager:
    '[points, emprises, type, statut, titulaires, amodiataires, documents, substances.legal.[code, domaine], titresSubstances, titresTitulaires, titresAmodiataires, titresEmprises]'
}

const phases = {
  eager: '[statut]'
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
