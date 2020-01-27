import { ITitresPhases } from '../../types'
import TitresPhases from '../models/titres-phases'
import options from './_options'

const titresPhasesGet = async () =>
  TitresPhases.query()
    .skipUndefined()
    .withGraphFetched(options.phases.graph)

const titrePhasesUpsert = async (titrePhases: ITitresPhases[]) =>
  TitresPhases.query().upsertGraph(titrePhases, {
    insertMissing: true,
    noDelete: true
  })

const titrePhasesDelete = async (titrePhasesIds: string[]) =>
  TitresPhases.query()
    .delete()
    .whereIn('titreDemarcheId', titrePhasesIds)

export { titresPhasesGet, titrePhasesUpsert, titrePhasesDelete }
