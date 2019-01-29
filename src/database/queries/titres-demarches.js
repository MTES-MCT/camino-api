const TitresDemarches = require('../models/titres-demarches')
const options = require('./_options')

const queries = {
  async titresDemarchesGet({ demarchesIds, titresIds }) {
    return TitresDemarches.query()
      .skipUndefined()
      .eager(options.demarches.eager)
      .orderBy('ordre')
      .whereIn('titresDemarches.typeId', demarchesIds)
      .whereIn('titresDemarches.titreId', titresIds)
  },

  async titreDemarcheGet(demarcheId) {
    return TitresDemarches.query()
      .eager(options.demarches.eager)
      .findById(demarcheId)
  },

  async titreDemarcheStatutIdUpdate({ id, statutId }) {
    return TitresDemarches.query()
      .skipUndefined()
      .findById(id)
      .patch({ statutId })
  },

  async titreDemarcheOrdreUpdate({ id, ordre }) {
    return TitresDemarches.query()
      .skipUndefined()
      .findById(id)
      .patch({ ordre })
  }
}

module.exports = queries
