const TitresEtapes = require('../models/titres-etapes')
const options = require('./_options')

const queries = {
  async titresEtapesGet({ etapesIds, demarchesIds }) {
    return TitresEtapes.query()
      .skipUndefined()
      .eager(options.etapes.eager)
      .orderBy('ordre')
      .whereIn('titresEtapes.typeId', etapesIds)
      .whereIn('titresEtapes.demarcheId', demarchesIds)
  },

  async titreEtapeUpdate({ id, props }) {
    return TitresEtapes.query()
      .skipUndefined()
      .findById(id)
      .patch(props)
  },

  async titreEtapeUpsert(etape) {
    return TitresEtapes.query()
      .upsertGraph(etape, options.etapes.update)
      .eager(options.etapes.eager)
  }
}

module.exports = queries
