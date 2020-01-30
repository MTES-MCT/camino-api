import { IDemarchesTypes, ITypes } from '../../types'

import { typesGet, demarchesTypesGet } from '../../database/queries/metas'

const metas = {
  types: [] as ITypes[],
  demarchesTypes: [] as IDemarchesTypes[]
}

const metasInit = async () => {
  metas.types = await typesGet()
  metas.demarchesTypes = await demarchesTypesGet()
}

export default metas

export { metasInit }
