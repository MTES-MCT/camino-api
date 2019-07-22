import {
  titrePhasesUpdate as queryTitrePhasesUpdate,
  titrePhasesDelete as queryTitrePhasesDelete
} from '../../database/queries/titres-phases'

const titrePhasesUpdate = titrePhases =>
  queryTitrePhasesUpdate(titrePhases).then(
    u => `Mise à jour: phases ${JSON.stringify(titrePhases)}`
  )

const titrePhasesDelete = titrePhasesIds =>
  queryTitrePhasesDelete(titrePhasesIds).then(
    u => `Suppression: phases ${titrePhasesIds.join(', ')}}`
  )

export { titrePhasesUpdate, titrePhasesDelete }
