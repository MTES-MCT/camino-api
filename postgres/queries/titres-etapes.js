const TitresEtapes = require('../models/titres-etapes')
const options = require('./_options')

const queries = {
  async titresEtapesGet({ etapeIds }) {
    return TitresEtapes.query()
      .skipUndefined()
      .eager(options.etapes.eager)
      .orderBy('ordre')
      .whereIn('titresEtapes.typeId', etapeIds)
  },

  async titreEtapeUpdate({ id, props }) {
    return TitresEtapes.query()
      .skipUndefined()
      .findById(id)
      .patch(props)
  },

  async titreEtapeUpsert(etape) {
    return TitresEtapes.query()
      .upsertGraph(etape)
      .eager(options.etapes.eager)
  }
}

module.exports = queries
