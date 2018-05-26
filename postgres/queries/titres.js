const Titres = require('../models/titres')

const options = {
  titresEager:
    '[type, domaine, statut, travaux, substancesPrincipales.legal, substancesSecondaires.legal, phases.type]',
  titresUpdate: {
    relate: [
      'type',
      'domaine',
      'statut',
      'travaux',
      'substancesPrincipales',
      'substancesSecondaires',
      'phases.type',
      'phases.emprise'
    ],
    unrelate: [
      'type',
      'domaine',
      'statut',
      'travaux',
      'substancesPrincipales',
      'substancesSecondaires',
      'phases.type',
      'phases.emprise'
    ],
    insertMissing: ['phases']
  }
}

const queries = {
  titre: async (id, context) =>
    Titres.query()
      .findById(id)
      .eager(options.titresEager),

  titres: async ({ typeId, domaineId, statutId, travauxId }, context) => {
    console.log('------------------->', context.user)
    return Titres.query()
      .whereIn('typeId', typeId)
      .whereIn('domaineId', domaineId)
      .whereIn('statutId', statutId)
      .whereIn('travauxId', travauxId)
      .eager(options.titresEager)
  },

  titreAjouter: async (titre, context) =>
    Titres.query()
      .insertGraph(titre, options.titresUpdate)
      .first()
      .eager(options.titresEager),

  titreSupprimer: async (id, context) =>
    Titres.query()
      .deleteById(id)
      .first()
      .eager(options.titresEager)
      .returning('*'),

  titreModifier: async (titre, context) =>
    Titres.query()
      .upsertGraph([titre], options.titresUpdate)
      .eager(options.titresEager)
      .first()
}

module.exports = queries
