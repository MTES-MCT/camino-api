const TitresPhases = require('../models/titres-phases')
const options = require('./_options')

const queries = {
  async titresPhasesGet() {
    return TitresPhases.query()
      .skipUndefined()
      .eager(options.phases.eager)
  },

  async titrePhaseUpdate({ titrePhase }) {
    return TitresPhases.query().upsertGraph(titrePhase, { insertMissing: true })
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
  },

  async titrePhaseDelete({ titreDemarcheId }) {
    return TitresPhases.query()
      .deleteById(titreDemarcheId)
      .returning('*')
  }
}

module.exports = queries
