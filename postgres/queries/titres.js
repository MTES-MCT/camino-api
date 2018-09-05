const Titres = require('../models/titres')
const { hasPermission } = require('../../auth/permissions')
const options = require('./_options')
// const knex = require('../../conf/knex')

const queries = {
  titre: async (id, user) =>
    Titres.query()
      .findById(id)
      .eager(options.titres.eager),

  titres: async (
    { typeIds, domaineIds, statutIds, substances, noms },
    user
  ) => {
    const q = await Titres.query()
      .skipUndefined()
      .eager(options.titres.eager)
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

  titresStatutUpdate: async ({ id, statutId }) =>
    Titres.query()
      .skipUndefined()
      .findById(id)
      .patch({ statutId }),

  titreAjouter: async (titre, user) =>
    hasPermission('admin', user)
      ? Titres.query()
          .insertGraph(titre, options.titres.update)
          .first()
          .eager(options.titres.eager)
      : null,

  titreSupprimer: async (id, user) =>
    hasPermission('admin', user)
      ? Titres.query()
          .deleteById(id)
          .first()
          .eager(options.titres.eager)
          .returning('*')
      : null,

  titreModifier: async (titre, user) =>
    hasPermission('admin', user)
      ? Titres.query()
          .upsertGraph([titre], options.titres.update)
          .eager(options.titres.eager)
          .first()
      : null
}

module.exports = queries
