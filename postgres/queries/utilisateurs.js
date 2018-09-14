const Utilisateurs = require('../models/utilisateurs')
const { hasPermission } = require('../../auth/permissions')

const queries = {
  utilisateurGet: async (id, user) => Utilisateurs.query().findById(id),

  utilisateursGet: async ({ noms }, user) => {
    const q = Utilisateurs.query()
      .skipUndefined()
      .eager(options.utilisateurs.eager)
      .whereIn('utilisateurs.typeId', typeIds)
      .whereIn('titres.domaineId', domaineIds)
      .whereIn('titres.statutId', statutIds)

    return q
  },

  utilisateurAjouter: async (utilisateur, user) =>
    hasPermission('admin', user)
      ? Utilisateurs.query()
          .insertGraph(utilisateur)
          .first()
      : null,

  utilisateurSupprimer: async (id, user) =>
    hasPermission('admin', user)
      ? Utilisateurs.query()
          .deleteById(id)
          .first()
          .returning('*')
      : null,

  utilisateurModifier: async (utilisateur, user) =>
    hasPermission('admin', user)
      ? Utilisateurs.query()
          .upsertGraph([utilisateur], options.utilisateurs.update)
          .eager(options.utilisateurs.eager)
          .first()
      : null
}

module.exports = queries
