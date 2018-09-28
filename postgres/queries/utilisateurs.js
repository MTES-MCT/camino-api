const Utilisateurs = require('../models/utilisateurs')
const options = require('./_options')

const utilisateurGet = async ({ id }) =>
  Utilisateurs.query()
    .findById(id)
    .eager(options.utilisateurs.eager)

const utilisateursGet = async ({ noms }) => {
  const q = Utilisateurs.query()
    .skipUndefined()
    .eager(options.utilisateurs.eager)
    .whereIn('utilisateurs.typeId', typeIds)
    .whereIn('titres.domaineId', domaineIds)
    .whereIn('titres.statutId', statutIds)

  return q
}

const utilisateurAdd = async utilisateur =>
  Utilisateurs.query()
    .insertGraph(utilisateur)
    .first()

const utilisateurRemove = async id =>
  Utilisateurs.query()
    .deleteById(id)
    .first()
    .returning('*')

const utilisateurUpdate = async utilisateur =>
  Utilisateurs.query()
    .upsertGraph([utilisateur], options.utilisateurs.update)
    .eager(options.utilisateurs.eager)
    .first()

module.exports = {
  utilisateurGet,
  utilisateursGet,
  utilisateurAdd,
  utilisateurRemove,
  utilisateurUpdate
}
