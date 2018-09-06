const TitresDemarches = require('../models/titres-demarches')
const options = require('./_options')

const queries = {
  titresDemarchesGet: async ({ demarcheIds }) =>
    TitresDemarches.query()
      .skipUndefined()
      .eager(options.demarches.eager)
      .whereIn('titresDemarches.demarcheId', demarcheIds),

  titreDemarcheStatutIdUpdate: async ({ id, demarcheStatutId }) =>
    TitresDemarches.query()
      .skipUndefined()
      .findById(id)
      .patch({ demarcheStatutId }),

  titreDemarcheOrdreUpdate: async ({ id, ordre }) =>
    TitresDemarches.query()
      .skipUndefined()
      .findById(id)
      .patch({ ordre })
}

module.exports = queries
