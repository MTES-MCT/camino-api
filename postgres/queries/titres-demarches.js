const TitresDemarches = require('../models/titres-demarches')
const options = require('./_options')

const queries = {
  titresDemarches: async ({ demarcheIds }) =>
    TitresDemarches.query()
      .skipUndefined()
      .eager(options.demarches.eager)
      .whereIn('titresDemarches.demarcheId', demarcheIds),

  titresDemarcheStatutPatch: async ({ id, demarcheStatutId }) =>
    TitresDemarches.query()
      .findById(id)
      .patch({ demarcheStatutId })
}

module.exports = queries
