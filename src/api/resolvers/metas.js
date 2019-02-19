import permissionsCheck from './_permissions-check'

import { restrictedDomaineIds, restrictedStatutIds } from './_restrictions'

import {
  typesGet,
  domainesGet,
  statutsGet,
  demarchesTypesGet,
  devisesGet,
  geoSystemesGet,
  volumeUnitesGet
} from '../../database/queries/metas'

const check = (elements, restrictedList) =>
  elements.filter(element => !restrictedList.find(id => id === element.id))

const metas = async (variables, context, info) => {
  const types = await typesGet()
  const devises = await devisesGet()
  const geoSystemes = await geoSystemesGet()
  const volumeUnites = await volumeUnitesGet()
  let domaines = await domainesGet()
  let statuts = await statutsGet()
  let demarchesTypes

  if (!context.user) {
    domaines = check(domaines, restrictedDomaineIds)
    statuts = check(statuts, restrictedStatutIds)
  }

  if (permissionsCheck(context.user, ['super', 'admin'])) {
    demarchesTypes = demarchesTypesGet()
  }

  return {
    types,
    domaines,
    statuts,
    demarchesTypes,
    devises,
    geoSystemes,
    volumeUnites
  }
}

export { metas }
