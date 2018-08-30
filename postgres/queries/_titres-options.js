const options = {
  eager:
    '[type, domaine, statut, demarches.[type, statut, etapes.[points, emprises, type, statut, titulaires, amodiataires, utilisateurs, documents, substances.legal.[code, domaine]]]]',
  update: {
    relate: ['type', 'domaine', 'statut', 'substances'],
    unrelate: ['type', 'domaine', 'statut', 'substances'],
    insertMissing: ['phases', 'phases.points']
  }
}

module.exports = options
