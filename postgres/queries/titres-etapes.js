const TitresEtapes = require('../models/titres-etapes')
const options = require('./_options')

const titresEtapesGet = async ({ etapeIds }) =>
  TitresEtapes.query()
    .skipUndefined()
    .eager(options.etapes.eager)
    .orderBy('ordre')
    .whereIn('titresEtapes.etapeId', etapeIds)

const titreEtapeOrdreUpdate = async ({ id, ordre }) => {
  console.log(id, ordre)
  return TitresEtapes.query()
    .skipUndefined()
    .findById(id)
    .patch({ ordre })
}

module.exports = {
  titresEtapesGet,
  titreEtapeOrdreUpdate
}
