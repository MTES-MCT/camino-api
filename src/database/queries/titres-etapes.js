import TitresEtapes from '../models/titres-etapes'
import options from './_options'

const titreEtapeGet = async titreEtapeId =>
  TitresEtapes.query()
    .eager(options.etapes.eager)
    .findById(titreEtapeId)

const titresEtapesGet = async ({ etapesIds, titresDemarchesIds }) =>
  TitresEtapes.query()
    .skipUndefined()
    .eager(options.etapes.eager)
    .orderBy('ordre')
    .whereIn('titresEtapes.typeId', etapesIds)
    .whereIn('titresEtapes.titreDemarcheId', titresDemarchesIds)

const titreEtapeUpdate = async ({ id, props }) =>
  TitresEtapes.query()
    .skipUndefined()
    .findById(id)
    .patch(props)

const titreEtapeUpsert = async etape =>
  TitresEtapes.query()
    .upsertGraph(etape, options.etapes.update)
    .eager(options.etapes.eager)

export { titreEtapeGet, titresEtapesGet, titreEtapeUpdate, titreEtapeUpsert }
