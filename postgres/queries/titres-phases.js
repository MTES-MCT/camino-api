const TitresPhases = require('../models/titres-phases')
const options = require('./_options')

const titresPhasesGet = async ({ titreDemarcheIds }) =>
  TitresPhases.query()
    .skipUndefined()
    .eager(options.phases.eager)
    .whereIn('titresPhases.titreDemarcheId', titreDemarcheIds)

const titrePhaseUpdate = async ({ titrePhase }) =>
  TitresPhases.query().upsertGraph(titrePhase, { insertMissing: true })
// {
//   console.log(titrePhase)
//   const exists = await TitresPhases.query().where(
//     'titreDemarcheId',
//     titrePhase.titreDemarcheId
//   )

//   if (exists) {
//     return TitresPhases.query()
//       .where('titreDemarcheId', titrePhase.titreDemarcheId)
//       .patch(titrePhase)
//   } else {
//     return TitresPhases.query().insert(titrePhase)
//   }
// },

const titrePhaseDelete = async ({ titreDemarcheId }) =>
  TitresPhases.query()
    .deleteById(titreDemarcheId)
    .returning('*')

module.exports = {
  titresPhasesGet,
  titrePhaseUpdate,
  titrePhaseDelete
}
