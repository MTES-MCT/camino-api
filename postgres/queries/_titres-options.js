const options = {
  eager:
    '[type, domaine, statut, substancesPrincipales.legal, substancesConnexes.legal, phases.[points, emprise, type]]',
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
