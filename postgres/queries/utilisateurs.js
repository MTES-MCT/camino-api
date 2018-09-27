const Utilisateurs = require('../models/utilisateurs')
const { hasPermission } = require('../../auth/permissions')

const utilisateurGet = async ({ id, password }, user) =>
  Utilisateurs.query().findById(id)

const utilisateursGet = async ({ noms }, user) => {
  const q = Utilisateurs.query()
    .skipUndefined()
    .eager(options.utilisateurs.eager)
    .whereIn('utilisateurs.typeId', typeIds)
    .whereIn('titres.domaineId', domaineIds)
    .whereIn('titres.statutId', statutIds)

  return q
}

const utilisateurAdd = async (utilisateur, user) =>
  hasPermission('admin', user)
    ? Utilisateurs.query()
        .insertGraph(utilisateur)
        .first()
    : null

const utilisateurSupprimer = async (id, user) =>
  hasPermission('admin', user)
    ? Utilisateurs.query()
        .deleteById(id)
        .first()
        .returning('*')
    : null

const utilisateurModifier = async (utilisateur, user) =>
  hasPermission('admin', user)
    ? Utilisateurs.query()
        .upsertGraph([utilisateur], options.utilisateurs.update)
        .eager(options.utilisateurs.eager)
        .first()
    : null

module.exports = {
  utilisateurGet,
  utilisateursGet,
  utilisateurAdd,
  utilisateurSupprimer,
  utilisateurModifier
}
