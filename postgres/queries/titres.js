const { raw } = require('objection')
const Titres = require('../models/titres')
const { hasPermission } = require('../../auth/permissions')
const titresOptions = require('./_titres-options')
// const knex = require('../../conf/knex')

const queries = {
  titre: async (id, user) =>
    Titres.query()
      .findById(id)
      .eager(titresOptions.eager),

  titres: async (
    { typeIds, domaineIds, statutIds, substances, noms },
    user
  ) => {
    const q = Titres.query()
      .skipUndefined()
      .eager(titresOptions.eager)
      .whereIn('titres.typeId', typeIds)
      .whereIn('titres.domaineId', domaineIds)
      .whereIn('titres.statutId', statutIds)

    if (noms) {
      q.whereRaw(`lower(??) ~* ${noms.map(n => '?').join('|')}`, [
        'titres.nom',
        ...noms.map(n => n.toLowerCase())
      ])
    }

    if (substances) {
      q.joinRelation('demarches.etapes.substances').where(builder => {
        builder
          .whereIn(
            'demarches:etapes:substances.id',
            substances.map(n => n.toLowerCase())
          )
          .orWhereIn(
            'demarches:etapes:substances.nom',
            substances.map(n => n.toLowerCase())
          )
          .orWhereIn('demarches:etapes:substances.symbole', substances)
      })
    }

    return q
  },

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
