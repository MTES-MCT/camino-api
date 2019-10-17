import {
  permissionsCheck,
  permissionsAdministrationsCheck
} from './_permissions-check'
import {
  restrictedDomaineIds,
  restrictedTypeIds,
  restrictedStatutIds
} from './_restrictions'

import {
  typesGet,
  domainesGet,
  statutsGet,
  devisesGet,
  geoSystemesGet,
  unitesGet,
  documentsTypesGet
} from '../../database/queries/metas'
import { utilisateurGet } from '../../database/queries/utilisateurs'
import options from '../../database/queries/_options'

const check = (elements, restrictedList) =>
  elements.filter(element => !restrictedList.find(id => id === element.id))

const metas = async (variables, context, info) => {
  const devises = await devisesGet()
  const geoSystemes = await geoSystemesGet()
  const unites = await unitesGet()
  const documentsTypes = await documentsTypesGet()
  let domaines = await domainesGet()
  let statuts = await statutsGet()
  let types = await typesGet({ eager: options.types.eager })

  if (!context.user) {
    domaines = check(domaines, restrictedDomaineIds)
    statuts = check(statuts, restrictedStatutIds)
  }

  const user = context.user && (await utilisateurGet(context.user.id))

  if (
    !context.user ||
    !(
      permissionsCheck(user, ['super']) ||
      permissionsAdministrationsCheck(user, ['ope-onf-973-01'])
    )
  ) {
    types = check(types, restrictedTypeIds)
  }

  return {
    types,
    devises,
    domaines,
    documentsTypes,
    statuts,
    geoSystemes,
    unites
  }
}

export { metas }
