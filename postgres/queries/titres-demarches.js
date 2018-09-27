const TitresDemarches = require('../models/titres-demarches')
const options = require('./_options')

const titresDemarchesGet = async ({ demarcheIds }) =>
  TitresDemarches.query()
    .skipUndefined()
    .eager(options.demarches.eager)
    .orderBy('ordre')
    .whereIn('titresDemarches.demarcheId', demarcheIds)

const titreDemarcheStatutIdUpdate = async ({ id, demarcheStatutId }) =>
  TitresDemarches.query()
    .skipUndefined()
    .findById(id)
    .patch({ demarcheStatutId })

const titreDemarcheOrdreUpdate = async ({ id, ordre }) =>
  TitresDemarches.query()
    .skipUndefined()
    .findById(id)
    .patch({ ordre })

module.exports = {
  titresDemarchesGet,
  titreDemarcheStatutIdUpdate,
  titreDemarcheOrdreUpdate
}
