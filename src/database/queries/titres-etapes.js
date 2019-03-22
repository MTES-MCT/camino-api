import TitresEtapes from '../models/titres-etapes'
import TitresCommunes from '../models/titres-communes'
import TitresAdministrations from '../models/titres-administrations'
import options from './_options'

const titreEtapeGet = async titreEtapeId =>
  TitresEtapes.query()
    .eager(options.etapes.eager)
    .findById(titreEtapeId)

const titresEtapesGet = async ({
  etapesIds,
  etapesTypeIds,
  titresDemarchesIds
} = {}) =>
  TitresEtapes.query()
    .skipUndefined()
    .eager(options.etapes.eager)
    .orderBy('ordre')
    .whereIn('titresEtapes.id', etapesIds)
    .whereIn('titresEtapes.typeId', etapesTypeIds)
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

const titresEtapesCommunesGet = async () => TitresCommunes.query()

const titreEtapeCommuneInsert = async ({ titreEtapeId, communeId }) =>
  TitresCommunes.query().insert({ titreEtapeId, communeId })

const titreEtapeCommuneDelete = async ({ titreEtapeId, communeId }) =>
  TitresCommunes.query({ titreEtapeId, communeId }).delete()

const titreEtapeAdministrationInsert = async ({
  titreEtapeId,
  administrationId
}) => TitresAdministrations.query().insert({ titreEtapeId, administrationId })

export {
  titreEtapeGet,
  titresEtapesGet,
  titreEtapeUpdate,
  titreEtapeUpsert,
  titreEtapeCommuneInsert,
  titreEtapeCommuneDelete,
  titresEtapesCommunesGet,
  titreEtapeAdministrationInsert
}
