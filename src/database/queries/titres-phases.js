import TitresPhases from '../models/titres-phases'
import options from './_options'

const titresPhasesGet = async () =>
  TitresPhases.query()
    .skipUndefined()
    .eager(options.phases.eager)

const titrePhaseUpdate = async ({ titrePhase }) =>
  TitresPhases.query().upsertGraph(titrePhase, { insertMissing: true })

const titrePhaseDelete = async ({ titreDemarcheId }) =>
  TitresPhases.query()
    .deleteById(titreDemarcheId)
    .returning('*')

export { titresPhasesGet, titrePhaseUpdate, titrePhaseDelete }
