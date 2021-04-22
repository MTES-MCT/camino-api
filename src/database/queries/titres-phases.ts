import { ITitrePhase } from '../../types'

import options from './_options'

import TitresPhases from '../models/titres-phases'

const titresPhasesGet = async () =>
  TitresPhases.query()
    .skipUndefined()
    .withGraphFetched(options.titresDemarchesPhases.graph)

const titrePhasesUpsert = async (titrePhases: ITitrePhase[]) =>
  TitresPhases.query().upsertGraph(titrePhases, {
    insertMissing: true,
    noDelete: true
  })

const titrePhasesDelete = async (titrePhasesIds: string[]) =>
  TitresPhases.query().delete().whereIn('titreDemarcheId', titrePhasesIds)

export { titresPhasesGet, titrePhasesUpsert, titrePhasesDelete }
