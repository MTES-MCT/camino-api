import {
  ITitreEtape,
  ITitreCommune,
  ITitreAdministrationLocale,
  IFields,
  IUtilisateur,
  ITitreEtapeJustificatif,
  ITitreForet,
  ITitreSDOMZone
} from '../../types'

import options from './_options'
import graphBuild from './graph/build'
import { fieldsFormat } from './graph/fields-format'

import TitresEtapes, { DBTitresEtapes } from '../models/titres-etapes'
import TitresCommunes from '../models/titres-communes'
import TitresEtapesJustificatifs from '../models/titres-etapes-justificatifs'
import TitresAdministrationsLocales from '../models/titres-administrations-locales'
import TitresForets from '../models/titres-forets'
import { titresEtapesQueryModify } from './permissions/titres-etapes'
import {
  createJournalCreate,
  patchJournalCreate,
  upsertJournalCreate
} from './journaux'
import TitresSDOMZones from '../models/titres--sdom-zones'

const titresEtapesQueryBuild = (
  { fields }: { fields?: IFields },
  user: IUtilisateur | null | undefined
) => {
  const graph = fields
    ? graphBuild(fields, 'etapes', fieldsFormat)
    : options.titresEtapes.graph

  const q = TitresEtapes.query().withGraphFetched(graph)

  titresEtapesQueryModify(q, user)

  // console.info(q.toKnexQuery().toString())

  return q
}

// utilisé dans le daily et le resolver des documents uniquement
const titreEtapeGet = async (
  titreEtapeId: string,
  { fields, fetchHeritage }: { fields?: IFields; fetchHeritage?: boolean },
  user: IUtilisateur | null | undefined
) => {
  const q = titresEtapesQueryBuild({ fields }, user)

  q.context({ fetchHeritage })

  return (await q
    .andWhere(b => {
      b.orWhere('titresEtapes.id', titreEtapeId)
      b.orWhere('titresEtapes.slug', titreEtapeId)
    })
    .first()) as ITitreEtape
}

// utilisé dans le daily uniquement
const titresEtapesGet = async (
  {
    titresEtapesIds,
    etapesTypesIds,
    titresDemarchesIds
  }: {
    titresEtapesIds?: string[] | null
    etapesTypesIds?: string[] | null
    titresDemarchesIds?: string[] | null
  } = {},
  { fields }: { fields?: IFields },
  user: IUtilisateur | null | undefined
) => {
  const q = titresEtapesQueryBuild({ fields }, user)

  if (titresEtapesIds) {
    q.whereIn('titresEtapes.id', titresEtapesIds)
  }

  if (etapesTypesIds) {
    q.whereIn('titresEtapes.typeId', etapesTypesIds)
  }

  if (titresDemarchesIds) {
    q.whereIn('titresEtapes.titreDemarcheId', titresDemarchesIds)
  }

  q.orderBy('ordre')

  return q
}

const titreEtapeCreate = async (
  titreEtape: Omit<ITitreEtape, 'id'>,
  user: IUtilisateur,
  titreId: string
) => {
  const newValue = await TitresEtapes.query()
    .insertAndFetch(titreEtape)
    .withGraphFetched(options.titresEtapes.graph)

  await createJournalCreate(newValue.id, user.id, titreId)

  return newValue
}

const titreEtapeUpdate = async (
  id: string,
  titreEtape: Partial<DBTitresEtapes>,
  user: IUtilisateur,
  titreId: string
) => {
  return patchJournalCreate<TitresEtapes>(
    id,
    titreEtape,
    TitresEtapes,
    user.id,
    titreId
  )
}

const titreEtapeUpsert = async (
  titreEtape: Partial<Pick<ITitreEtape, 'id'>> & Omit<ITitreEtape, 'id'>,
  user: IUtilisateur,
  titreId: string
) =>
  upsertJournalCreate<TitresEtapes>(
    titreEtape.id,
    titreEtape,
    TitresEtapes,
    options.titresEtapes.update,
    options.titresEtapes.graph,
    user.id,
    titreId
  )

const titresEtapesCommunesGet = async () => TitresCommunes.query()

const titresEtapesCommunesUpdate = async (
  titresEtapesCommunes: ITitreCommune
) =>
  TitresCommunes.query().upsertGraph(titresEtapesCommunes, {
    insertMissing: true
  })

const titreEtapeCommuneDelete = async (
  titreEtapeId: string,
  communeId: string
) =>
  TitresCommunes.query()
    .delete()
    .where('titreEtapeId', titreEtapeId)
    .andWhere('communeId', communeId)

const titresEtapesForetsUpdate = async (titresEtapesForets: ITitreForet) =>
  TitresForets.query().upsertGraph(titresEtapesForets, {
    insertMissing: true
  })

const titreEtapeForetDelete = async (titreEtapeId: string, foretId: string) =>
  TitresForets.query()
    .delete()
    .where('titreEtapeId', titreEtapeId)
    .andWhere('foretId', foretId)

const titresEtapesSDOMZonesUpdate = async (
  titresEtapesSdomZones: ITitreSDOMZone
) =>
  TitresSDOMZones.query().upsertGraph(titresEtapesSdomZones, {
    insertMissing: true
  })

const titreEtapeSdomZoneDelete = async (
  titreEtapeId: string,
  sdomZoneId: string
) =>
  TitresSDOMZones.query()
    .delete()
    .where('titreEtapeId', titreEtapeId)
    .andWhere('sdomZoneId', sdomZoneId)

const titresEtapesJustificatifsUpsert = async (
  titresEtapesJustificatifs: ITitreEtapeJustificatif[]
) =>
  TitresEtapesJustificatifs.query().upsertGraph(titresEtapesJustificatifs, {
    insertMissing: true
  })

const titreEtapeJustificatifsDelete = async (
  titreEtapeId: string,
  documentId?: string
) => {
  const q = TitresEtapesJustificatifs.query().where({ titreEtapeId })

  if (documentId) {
    q.where({ documentId })
  }

  return q.delete()
}

const titresEtapesAdministrationsCreate = async (
  titresEtapesAdministrations: ITitreAdministrationLocale[]
) => TitresAdministrationsLocales.query().insert(titresEtapesAdministrations)

const titreEtapeAdministrationDelete = async (
  titreEtapeId: string,
  administrationId: string
) =>
  TitresAdministrationsLocales.query()
    .delete()
    .where('titreEtapeId', titreEtapeId)
    .andWhere('administrationId', administrationId)

export {
  titresEtapesGet,
  titreEtapeGet,
  titreEtapeCreate,
  titreEtapeUpdate,
  titreEtapeUpsert,
  titresEtapesCommunesUpdate,
  titreEtapeCommuneDelete,
  titresEtapesCommunesGet,
  titresEtapesForetsUpdate,
  titreEtapeForetDelete,
  titresEtapesSDOMZonesUpdate,
  titreEtapeSdomZoneDelete,
  titresEtapesJustificatifsUpsert,
  titreEtapeJustificatifsDelete,
  titresEtapesAdministrationsCreate,
  titreEtapeAdministrationDelete
}
