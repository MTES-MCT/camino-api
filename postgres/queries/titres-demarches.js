const TitresDemarches = require('../models/titres-demarches')
const options = require('./_options')

const queries = {
  async titresDemarchesGet({ demarcheIds }) {
    return TitresDemarches.query()
      .skipUndefined()
      .eager(options.demarches.eager)
      .orderBy('ordre')
      .whereIn('titresDemarches.demarcheId', demarcheIds)
  },

  async titreDemarcheStatutIdUpdate({ id, demarcheStatutId }) {
    return TitresDemarches.query()
      .skipUndefined()
      .findById(id)
      .patch({ demarcheStatutId })
  },

  async titreDemarcheOrdreUpdate({ id, ordre }) {
    return TitresDemarches.query()
      .skipUndefined()
      .findById(id)
      .patch({ ordre })
  }
}

module.exports = queries
