const TitresEtapes = require('../models/titres-etapes')
const options = require('./_options')

const queries = {
  async titresEtapesGet({ etapeIds }) {
    return TitresEtapes.query()
      .skipUndefined()
      .eager(options.etapes.eager)
      .orderBy('ordre')
      .whereIn('titresEtapes.etapeId', etapeIds)
  },

  async titreEtapeOrdreUpdate({ id, ordre }) {
    return TitresEtapes.query()
      .skipUndefined()
      .findById(id)
      .patch({ ordre })
  }
}
module.exports = queries
