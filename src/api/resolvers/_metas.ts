import { IDemarchesTypes, ITitresTypes } from '../../types'

import { titresTypesGet, demarchesTypesGet } from '../../database/queries/metas'

const metas = {
  titresTypes: [] as ITitresTypes[],
  demarchesTypes: [] as IDemarchesTypes[]
}

const metasInit = async () => {
  metas.titresTypes = await titresTypesGet()
  metas.demarchesTypes = await demarchesTypesGet()
}

export default metas

export { metasInit }
