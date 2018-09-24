const etapes = {
  eager:
    '[points, emprises, type, statut, titulaires, amodiataires, utilisateurs, documents, substances.legal.[code, domaine], titresSubstances, titresTitulaires, titresAmodiataires, titresUtilisateurs, titresEmprises]'
}

const phases = {
  eager: '[statut]'
}

const demarches = {
  eager: `[type, statut, phase.${phases.eager}, etapes.${etapes.eager}]`
}

const titres = {
  eager: `[type, domaine, statut, demarches(orderAsc).${demarches.eager}]`,
  update: {
    relate: ['type', 'domaine', 'statut', 'substances'],
    unrelate: ['type', 'domaine', 'statut', 'substances'],
    insertMissing: ['phases', 'phases.points']
  }
}

const options = {
  phases,
  etapes,
  demarches,
  titres
}

module.exports = options
