import {
  IActiviteStatut,
  IActiviteType,
  IActiviteTypeDocumentType,
  IActiviteTypePays,
  IActiviteTypeTitreType,
  IFields,
  IUtilisateur
} from '../../types'

import options from './_options'
import graphBuild from './graph/build'
import { fieldsFormat } from './graph/fields-format'

import ActivitesTypes from '../models/activites-types'
import ActivitesTypesTitresTypes from '../models/activites-types--titres-types'
import ActivitesStatuts from '../models/activites-statuts'
import ActivitesTypesDocumentsTypes from '../models/activites-types--documents-types'
import ActivitesTypesPays from '../models/activites-types--pays'
import { activitesTypesQueryModify } from './permissions/metas'

const activitesTypesGet = async (
  { fields }: { fields?: IFields },
  user: IUtilisateur | null
) => {
  const graph = fields
    ? graphBuild(fields, 'activitesTypes', fieldsFormat)
    : options.activitesTypes.graph

  const q = ActivitesTypes.query().withGraphFetched(graph).modify('orderAsc')

  activitesTypesQueryModify(q, user)

  return q
}

const activitesStatutsGet = async () => ActivitesStatuts.query()

const activiteStatutUpdate = async (
  id: string,
  props: Partial<IActiviteStatut>
) => ActivitesStatuts.query().patchAndFetchById(id, props)

const activiteTypeUpdate = async (id: string, props: Partial<IActiviteType>) =>
  ActivitesTypes.query().patchAndFetchById(id, props)

const activiteTypeCreate = async (activiteType: IActiviteType) =>
  ActivitesTypes.query().insertGraphAndFetch(
    activiteType,
    options.activitesTypes.update
  )

const activiteTypeDelete = async (activiteTypeId: string) =>
  ActivitesTypes.query().deleteById(activiteTypeId)

const activitesTypesTitresTypesGet = async () =>
  ActivitesTypesTitresTypes.query()

const activiteTypeTitreTypeCreate = async (
  activiteTypeTitreType: IActiviteTypeTitreType
) => ActivitesTypesTitresTypes.query().insertAndFetch(activiteTypeTitreType)

const activiteTypeTitreTypeDelete = async ({
  activiteTypeId,
  titreTypeId
}: {
  activiteTypeId: string
  titreTypeId: string
}) =>
  ActivitesTypesTitresTypes.query().deleteById([activiteTypeId, titreTypeId])

const activitesTypesDocumentsTypesGet = async () =>
  ActivitesTypesDocumentsTypes.query()

const activiteTypeDocumentTypeCreate = async (
  activiteTypeDocumentType: IActiviteTypeDocumentType
) =>
  ActivitesTypesDocumentsTypes.query().insertAndFetch(activiteTypeDocumentType)

const activiteTypeDocumentTypeUpdate = async (
  activiteTypeId: string,
  documentTypeId: string,
  activiteTypeDocumentType: Partial<IActiviteTypeDocumentType>
) =>
  ActivitesTypesDocumentsTypes.query()
    .patch(activiteTypeDocumentType)
    .findById([activiteTypeId, documentTypeId])

const activiteTypeDocumentTypeDelete = async ({
  activiteTypeId,
  documentTypeId
}: {
  activiteTypeId: string
  documentTypeId: string
}) =>
  ActivitesTypesDocumentsTypes.query().deleteById([
    activiteTypeId,
    documentTypeId
  ])

const activitesTypesPaysGet = async () => ActivitesTypesPays.query()

const activiteTypePaysCreate = async (activiteTypePays: IActiviteTypePays) =>
  ActivitesTypesPays.query().insertAndFetch(activiteTypePays)

const activiteTypePaysDelete = async ({
  activiteTypeId,
  paysId
}: {
  activiteTypeId: string
  paysId: string
}) => ActivitesTypesPays.query().deleteById([activiteTypeId, paysId])

export {
  activitesTypesGet,
  activiteTypeUpdate,
  activiteTypeCreate,
  activiteTypeDelete,
  activitesStatutsGet,
  activiteStatutUpdate,
  activitesTypesTitresTypesGet,
  activiteTypeTitreTypeCreate,
  activiteTypeTitreTypeDelete,
  activitesTypesDocumentsTypesGet,
  activiteTypeDocumentTypeCreate,
  activiteTypeDocumentTypeUpdate,
  activiteTypeDocumentTypeDelete,
  activitesTypesPaysGet,
  activiteTypePaysCreate,
  activiteTypePaysDelete
}
