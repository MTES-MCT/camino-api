const Utilisateurs = require('../models/utilisateurs')
const options = require('./_options')

const queries = {
  async utilisateurGet(id) {
    const utilisateur = await Utilisateurs.query()
      .findById(id)
      .eager(options.utilisateurs.eager)

    return utilisateur
  },

  async utilisateurByEmailGet(email) {
    const utilisateur = await Utilisateurs.query()
      .where('email', email)
      .eager(options.utilisateurs.eager)
      .first()

    return utilisateur
  },

  async utilisateursGet({
    noms,
    entrepriseIds,
    administrationIds,
    permissionIds
  }) {
    const q = Utilisateurs.query()
      .skipUndefined()
      .eager(options.utilisateurs.eager)
      .whereIn('utilisateurs.administrationId', administrationIds)
      .whereIn('utilisateurs.entrepriseId', entrepriseIds)
      .whereIn('utilisateurs.permissionId', permissionIds)

    if (noms) {
      q.whereRaw(`lower(??) ~* ${noms.map(n => '?').join('|')}`, [
        'utilisateurs.nom',
        ...noms.map(n => n.toLowerCase())
      ])
    }

    return q
  },

  async utilisateurAdd(utilisateur) {
    return Utilisateurs.query()
      .insertGraph(utilisateur, options.utilisateurs.update)
      .eager(options.utilisateurs.eager)
      .first()
  },

  async utilisateurRemove(id) {
    return Utilisateurs.query()
      .deleteById(id)
      .first()
      .returning('*')
  },

  async utilisateurUpdate(utilisateur) {
    return Utilisateurs.query()
      .upsertGraphAndFetch(utilisateur, options.utilisateurs.update)
      .eager(options.utilisateurs.eager)
  }
}

module.exports = queries
