const Titres = require('../models/titres')
const { hasPermission } = require('../../auth/permissions')
const titresOptions = require('./_titres-options')
const knex = require('../../conf/knex')

const queries = {
  titre: async (id, user) =>
    Titres.query()
      .findById(id)
      .eager(titresOptions.eager),

  titres: async (
    { typeIds, domaineIds, statutIds, polices, substances },
    user
  ) =>
    // Titres.raw(
    //   `SELECT t.* FROM titres t
    // WHERE t.typeId in (:typeIds)
    // AND t.domaineId in (:domaineIds)
    // AND t.statutId in (:statutIds)
    // AND t.police in (:polices)
    // AND (
    //     lower(s.label) in (:substances)
    //     OR lower(s.symbole) IN (:substances)
    // )
    // LEFT JOIN titresSubstancesPrincipales tsp on tsp.titreId = t.id
    // LEFT JOIN substances s on s.id = tsp.substanceId    `,
    //   {
    //     typeIds,
    //     domaineIds,
    //     statutIds,
    //     polices,
    //     substances
    //   }
    // ),

    Titres.query()
      .whereIn('typeId', typeIds)
      .whereIn('domaineId', domaineIds)
      .whereIn('statutId', statutIds)
      .whereIn('police', polices)
      // .whereIn('s.symbole', substances)
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
