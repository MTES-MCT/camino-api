import { IActiviteType, IFields } from '../../types'
import ActivitesTypes from '../models/activites-types'
import TitresTypesActivitesTypes from '../models/titres-types--activites-types'

import options from './_options'
import graphBuild from './graph/build'
import { fieldsFormat } from './graph/fields-format'
import { userGet } from './utilisateurs'

import { activitesTypesPermissionQueryBuild } from './permissions/metas'

const activitesTypesGet = async (
  { fields }: { fields?: IFields },
  userId?: string
) => {
  const user = await userGet(userId)

  const graph = fields
    ? graphBuild(fields, 'activitesTypes', fieldsFormat)
    : options.activitesTypes.graph

  const q = ActivitesTypes.query().withGraphFetched(graph).modify('orderAsc')

  activitesTypesPermissionQueryBuild(q, user)

  return q
}

const activiteTypeUpdate = async (id: string, props: Partial<IActiviteType>) =>
  ActivitesTypes.query().patchAndFetchById(id, props)

const activiteTypeCreate = async (activiteType: IActiviteType) =>
  ActivitesTypes.query().insertGraphAndFetch(
    activiteType,
    options.activitesTypes.update
  )

const activiteTypeDelete = async (activiteTypeId: string) =>
  ActivitesTypes.query().deleteById(activiteTypeId)

const titreTypeActiviteTypeDelete = async ({
  activiteTypeId,
  titreTypeId
}: {
  activiteTypeId: string
  titreTypeId: string
}) =>
  TitresTypesActivitesTypes.query().deleteById([titreTypeId, activiteTypeId])

export {
  activitesTypesGet,
  activiteTypeUpdate,
  activiteTypeCreate,
  activiteTypeDelete,
  titreTypeActiviteTypeDelete
}
