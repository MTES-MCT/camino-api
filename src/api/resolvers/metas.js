import permissionsCheck from './_permissions-check'

import {
  restrictedDomaineIds,
  restrictedStatutIds,
  restrictedTypeIds
} from './_restrictions'

import {
  typesGet,
  domainesGet,
  statutsGet,
  devisesGet,
  geoSystemesGet,
  volumeUnitesGet,
  emprisesGet
} from '../../database/queries/metas'

const check = (elements, restrictedList) =>
  elements.filter(element => !restrictedList.find(id => id === element.id))

const metas = async (variables, context, info) => {
  const devises = await devisesGet()
  const geoSystemes = await geoSystemesGet()
  const volumeUnites = await volumeUnitesGet()
  const emprises = await emprisesGet()
  let domaines = await domainesGet()
  let statuts = await statutsGet()
  let types = await typesGet()

  if (!context.user) {
    domaines = check(domaines, restrictedDomaineIds)
    statuts = check(statuts, restrictedStatutIds)
  }

  if (!context.user || !permissionsCheck(context.user, ['super', 'onf'])) {
    types = check(types, restrictedTypeIds)
  }

  return {
    types,
    domaines,
    statuts,
    devises,
    geoSystemes,
    volumeUnites,
    emprises
  }
}

export { metas }
