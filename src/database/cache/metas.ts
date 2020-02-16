import { IDemarcheType, ITitreType } from '../../types'

import { titresTypesGet, demarchesTypesGet } from '../queries/metas'

const metas = {
  titresTypes: [] as ITitreType[],
  demarchesTypes: [] as IDemarcheType[]
}

const metasInit = async () => {
  metas.titresTypes = await titresTypesGet()
  metas.demarchesTypes = await demarchesTypesGet()
}

export default metas

export { metasInit }
