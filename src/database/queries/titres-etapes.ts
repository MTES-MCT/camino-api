import { raw, Transaction } from 'objection'
import {
  ITitreEtape,
  ITitreCommune,
  ITitreAdministrationLocale,
  IFields,
  IUtilisateur,
  ITitreEtapeJustificatif,
  ITitreForet
} from '../../types'

import options from './_options'
import graphBuild from './graph/build'
import { fieldsFormat } from './graph/fields-format'

import TitresEtapes from '../models/titres-etapes'
import TitresCommunes from '../models/titres-communes'
import TitresEtapesJustificatifs from '../models/titres-etapes-justificatifs'
import TitresAdministrationsLocales from '../models/titres-administrations-locales'
import TitresForets from '../models/titres-forets'
import { titresEtapesQueryModify } from './permissions/titres-etapes'

const titresEtapesQueryBuild = (
  { fields }: { fields?: IFields },
  user: IUtilisateur | null
) => {
  const graph = fields
    ? graphBuild(fields, 'etapes', fieldsFormat)
    : options.titresEtapes.graph

  const q = TitresEtapes.query().skipUndefined().withGraphFetched(graph)

  titresEtapesQueryModify(q, user)

  // console.info(q.toKnexQuery().toString())

  return q
}

// utilisé dans le daily et le resolver des documents uniquement
const titreEtapeGet = async (
  titreEtapeId: string,
  { fields, fetchHeritage }: { fields?: IFields; fetchHeritage?: boolean },
  user: IUtilisateur | null
) => {
  const q = titresEtapesQueryBuild({ fields }, user)

  q.context({ fetchHeritage })

  return (await q.findById(titreEtapeId)) as ITitreEtape
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
  user: IUtilisateur | null
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

const titreEtapeCreate = async (titreEtape: ITitreEtape) =>
  TitresEtapes.query()
    .insertAndFetch(titreEtape)
    .withGraphFetched(options.titresEtapes.graph)

const titreEtapeUpdate = async (id: string, titreEtape: Partial<ITitreEtape>) =>
  TitresEtapes.query().patch(titreEtape).findById(id)

const titreEtapeDelete = async (id: string, trx?: Transaction) =>
  TitresEtapes.query(trx)
    .deleteById(id)
    .withGraphFetched(options.titresEtapes.graph)
    .returning('*')

const titreEtapeUpsert = async (titreEtape: ITitreEtape, trx?: Transaction) =>
  TitresEtapes.query(trx)
    .upsertGraph(titreEtape, options.titresEtapes.update)
    .withGraphFetched(options.titresEtapes.graph)
    .returning('*')

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
  titresEtapesJustificatifsUpsert,
  titreEtapeJustificatifsDelete,
  titresEtapesAdministrationsCreate,
  titreEtapeAdministrationDelete,
  titreEtapeDelete
}
