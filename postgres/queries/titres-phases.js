const TitresPhases = require('../models/titres-phases')
const options = require('./_options')

const titresPhasesGet = async ({ titreDemarcheIds }, user) =>
  TitresPhases.query()
    .skipUndefined()
    .eager(options.phases.eager)
    .whereIn('titresPhases.titreDemarcheId', titreDemarcheIds)

const titrePhaseUpdate = async ({ titrePhase }, user) =>
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

const titrePhaseDelete = async ({ titreDemarcheId }, user) =>
  TitresPhases.query()
    .deleteById(titreDemarcheId)
    .returning('*')

module.exports = {
  titresPhasesGet,
  titrePhaseUpdate,
  titrePhaseDelete
}
