import TitresPhases from '../models/titres-phases'
import options from './_options'

const titresPhasesGet = async () =>
  TitresPhases.query()
    .skipUndefined()
    .withGraphFetched(options.phases.graph)

const titrePhasesUpdate = async titrePhases =>
  TitresPhases.query().upsertGraph(titrePhases, {
    insertMissing: true,
    noDelete: true
  })

const titrePhasesDelete = async titrePhasesIds =>
  TitresPhases.query()
    .delete()
    .whereIn('titreDemarcheId', titrePhasesIds)

export { titresPhasesGet, titrePhasesUpdate, titrePhasesDelete }
