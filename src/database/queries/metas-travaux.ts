import {
  IFields,
  ITravauxEtapeType,
  ITravauxEtapeTypeDocumentType,
  ITravauxEtapeTypeEtapeStatut,
  ITravauxType,
  ITravauxTypeTravauxEtapeType,
  IUtilisateur
} from '../../types'

import TravauxTypes from '../models/travaux-types'

import options from './_options'
import graphBuild from './graph/build'
import { fieldsFormat } from './graph/fields-format'

import {
  travauxTypesQueryModify,
  travauxEtapesTypesQueryModify
} from './permissions/metas-travaux'
import TravauxTypesTravauxEtapesTypes from '../models/travaux-types--travaux-etapes-types'
import TravauxEtapesTypes from '../models/travaux-etapes-types'
import TravauxEtapesTypesDocumentsTypes from '../models/travaux-etapes-types--documents-types'
import TravauxEtapesTypesEtapesStatuts from '../models/travaux-types--travaux-etapes-statuts'

const travauxTypesGet = async (
  { fields }: { fields?: IFields } = {},
  user: IUtilisateur | null
) => {
  const graph = fields
    ? graphBuild(fields, 'travauxTypes', fieldsFormat)
    : options.travauxTypes.graph

  const q = TravauxTypes.query().withGraphFetched(graph).orderBy('ordre')

  travauxTypesQueryModify(q, user)

  return q
}

const travauxTypeUpdate = async (id: string, props: Partial<ITravauxType>) =>
  TravauxTypes.query().patchAndFetchById(id, props)

const travauxEtapeTypeGet = async (
  id: string,
  { fields }: { fields?: IFields } = {}
) => {
  const graph = fields
    ? graphBuild(fields, 'travauxEtapesTypes', fieldsFormat)
    : options.travauxEtapesTypes.graph

  return TravauxEtapesTypes.query().withGraphFetched(graph).findById(id)
}

const travauxEtapeTypeUpdate = async (
  id: string,
  props: Partial<ITravauxEtapeType>
) => TravauxEtapesTypes.query().patchAndFetchById(id, props)

const travauxEtapesTypesGet = async (
  { titreTravauxId }: { titreTravauxId?: string },
  { fields }: { fields?: IFields } = {},
  user: IUtilisateur | null
) => {
  const graph = fields
    ? graphBuild(fields, 'travauxEtapesTypes', fieldsFormat)
    : options.travauxEtapesTypes.graph

  const q = TravauxEtapesTypes.query().withGraphFetched(graph).orderBy('ordre')

  if (titreTravauxId) {
    travauxEtapesTypesQueryModify(q, user, {})
  }

  return q
}

const travauxTypesTravauxEtapesTypesGet = async () =>
  TravauxTypesTravauxEtapesTypes.query().orderBy([
    'travauxTypeId',
    'travauxEtapeTypeId'
  ])

const travauxTypeTravauxEtapeTypeUpdate = async (
  travauxTypeId: string,
  etapeTypeId: string,
  props: Partial<ITravauxTypeTravauxEtapeType>
) =>
  TravauxTypesTravauxEtapesTypes.query().patchAndFetchById(
    [travauxTypeId, etapeTypeId],
    props
  )

const travauxTypeTravauxEtapeTypeCreate = async (
  travauxTypeTravauxEtapeType: ITravauxTypeTravauxEtapeType
) =>
  TravauxTypesTravauxEtapesTypes.query().insertAndFetch(
    travauxTypeTravauxEtapeType
  )

const travauxTypeTravauxEtapeTypeDelete = async (
  travauxTypeId: string,
  etapeTypeId: string
) =>
  TravauxTypesTravauxEtapesTypes.query().deleteById([
    travauxTypeId,
    etapeTypeId
  ])

const travauxEtapesTypesDocumentsTypesGet = async () =>
  TravauxEtapesTypesDocumentsTypes.query().orderBy([
    'travauxEtapeTypeId',
    'documentTypeId'
  ])

const travauxEtapeTypeDocumentTypeUpdate = async (
  travauxEtapeTypeId: string,
  documentTypeId: string,
  props: Partial<ITravauxEtapeTypeDocumentType>
) =>
  TravauxEtapesTypesDocumentsTypes.query().patchAndFetchById(
    [travauxEtapeTypeId, documentTypeId],
    props
  )

const travauxEtapeTypeDocumentTypeCreate = async (
  TravauxEtapeTypeDocumentType: ITravauxEtapeTypeDocumentType
) =>
  TravauxEtapesTypesDocumentsTypes.query().insertAndFetch(
    TravauxEtapeTypeDocumentType
  )

const travauxEtapeTypeDocumentTypeDelete = async (
  travauxEtapeTypeId: string,
  documentTypeId: string
) =>
  TravauxEtapesTypesDocumentsTypes.query().deleteById([
    travauxEtapeTypeId,
    documentTypeId
  ])

const travauxEtapesTypesEtapesStatutsGet = async () =>
  TravauxEtapesTypesEtapesStatuts.query().orderBy([
    'travauxEtapeTypeId',
    'etapeStatutId'
  ])

const travauxEtapeTypeEtapeStatutUpdate = async (
  travauxEtapeTypeId: string,
  etapeStatutId: string,
  props: Partial<ITravauxEtapeTypeEtapeStatut>
) =>
  TravauxEtapesTypesEtapesStatuts.query().patchAndFetchById(
    [travauxEtapeTypeId, etapeStatutId],
    props
  )

const travauxEtapeTypeEtapeStatutCreate = async (
  TravauxEtapeTypeEtapeStatut: ITravauxEtapeTypeEtapeStatut
) =>
  TravauxEtapesTypesEtapesStatuts.query().insertAndFetch(
    TravauxEtapeTypeEtapeStatut
  )

const travauxEtapeTypeEtapeStatutDelete = async (
  travauxEtapeTypeId: string,
  etapeStatutId: string
) =>
  TravauxEtapesTypesEtapesStatuts.query().deleteById([
    travauxEtapeTypeId,
    etapeStatutId
  ])

export {
  travauxTypesGet,
  travauxTypeUpdate,
  travauxEtapesTypesGet,
  travauxEtapeTypeGet,
  travauxEtapeTypeUpdate,
  travauxTypesTravauxEtapesTypesGet,
  travauxTypeTravauxEtapeTypeUpdate,
  travauxTypeTravauxEtapeTypeCreate,
  travauxTypeTravauxEtapeTypeDelete,
  travauxEtapesTypesDocumentsTypesGet,
  travauxEtapeTypeDocumentTypeUpdate,
  travauxEtapeTypeDocumentTypeCreate,
  travauxEtapeTypeDocumentTypeDelete,
  travauxEtapesTypesEtapesStatutsGet,
  travauxEtapeTypeEtapeStatutUpdate,
  travauxEtapeTypeEtapeStatutCreate,
  travauxEtapeTypeEtapeStatutDelete
}
