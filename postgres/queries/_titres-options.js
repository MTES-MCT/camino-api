const options = {
  eager:
    '[type, domaine, statut, demarches.[type, statut, etapes.[points, emprises, type, statut, titulaires, amodiataires, utilisateurs, substances.legal.[code, domaine]]]]',
  update: {
    relate: [
      'type',
      'domaine',
      'statut',
      'substances',
      'phases.type',
      'phases.emprise'
    ],
    unrelate: [
      'type',
      'domaine',
      'statut',
      'substances',
      'phases.type',
      'phases.emprise'
    ],
    insertMissing: ['phases', 'phases.points']
  }
}

module.exports = options
