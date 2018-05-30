const Titres = require('../models/titres')
const { hasPermission } = require('../../auth/permissions')
const titresOptions = require('./_titres-options')

const queries = {
  titre: async (id, user) =>
    Titres.query()
      .findById(id)
      .eager(titresOptions.eager),

  titres: async ({ typeId, domaineId, statutId, police }, user) =>
    Titres.query()
      .whereIn('typeId', typeId)
      .whereIn('domaineId', domaineId)
      .whereIn('statutId', statutId)
      .whereIn('police', police)
      .eager(titresOptions.eager),

  titreAjouter: async (titre, user) =>
    hasPermission('admin', user)
      ? Titres.query()
          .insertGraph(titre, titresOptions.update)
          .first()
          .eager(titresOptions.eager)
      : null,

  titreSupprimer: async (id, user) =>
    hasPermission('admin', user)
      ? Titres.query()
          .deleteById(id)
          .first()
          .eager(titresOptions.eager)
          .returning('*')
      : null,

  titreModifier: async (titre, user) =>
    hasPermission('admin', user)
      ? Titres.query()
          .upsertGraph([titre], titresOptions.update)
          .eager(titresOptions.eager)
          .first()
      : null
}

module.exports = queries
