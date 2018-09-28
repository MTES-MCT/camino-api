const Utilisateurs = require('../models/utilisateurs')
const { hasPermission } = require('../../auth/permissions')
const options = require('./_options')

const utilisateurGet = async ({ id }, user) =>
  Utilisateurs.query()
    .findById(id)
    .eager(options.utilisateurs.eager)

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

const utilisateurRemove = async (id, user) =>
  hasPermission('admin', user)
    ? Utilisateurs.query()
        .deleteById(id)
        .first()
        .returning('*')
    : null

const utilisateurUpdate = async (utilisateur, user) =>
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
  utilisateurRemove,
  utilisateurUpdate
}
