import { IDemarcheType, ITitreType, IDevise, IUnite } from '../../types'

import {
  titresTypesGet,
  demarchesTypesGet,
  devisesGet,
  unitesGet
} from '../queries/metas'

const metas = {
  titresTypes: [] as ITitreType[],
  demarchesTypes: [] as IDemarcheType[],
  devises: [] as IDevise[],
  unites: [] as IUnite[]
}

const metasInit = async () => {
  metas.titresTypes = await titresTypesGet()
  metas.demarchesTypes = await demarchesTypesGet()

  metas.devises = await devisesGet()
  metas.unites = await unitesGet()
}

export default metas

export { metasInit }
