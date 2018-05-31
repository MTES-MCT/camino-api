const options = {
  eager:
    '[type, domaine, statut, substancesPrincipales.legal, substancesConnexes.legal, phases.type, phases.points]',
  update: {
    relate: [
      'type',
      'domaine',
      'statut',
      'substancesPrincipales',
      'substancesConnexes',
      'phases.type',
      'phases.emprise'
    ],
    unrelate: [
      'type',
      'domaine',
      'statut',
      'substancesPrincipales',
      'substancesConnexes',
      'phases.type',
      'phases.emprise'
    ],
    insertMissing: ['phases', 'phases.points']
  }
}

module.exports = options
