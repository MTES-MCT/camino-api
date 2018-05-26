const Titres = require('../models/titres')
const { hasPermission } = require('../../auth/tests')

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
  titre: async (id, user) =>
    Titres.query()
      .findById(id)
      .eager(options.titresEager),

  titres: async ({ typeId, domaineId, statutId, travauxId }, user) =>
    Titres.query()
      .whereIn('typeId', typeId)
      .whereIn('domaineId', domaineId)
      .whereIn('statutId', statutId)
      .whereIn('travauxId', travauxId)
      .eager(options.titresEager),

  titreAjouter: async (titre, user) =>
    hasPermission('admin', user)
      ? Titres.query()
          .insertGraph(titre, options.titresUpdate)
          .first()
          .eager(options.titresEager)
      : null,

  titreSupprimer: async (id, user) =>
    hasPermission('admin', user)
      ? Titres.query()
          .deleteById(id)
          .first()
          .eager(options.titresEager)
          .returning('*')
      : null,

  titreModifier: async (titre, user) =>
    hasPermission('admin', user)
      ? Titres.query()
          .upsertGraph([titre], options.titresUpdate)
          .eager(options.titresEager)
          .first()
      : null
}

module.exports = queries
