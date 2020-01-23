import { typesGet, demarchesTypesGet } from '../../database/queries/metas'

const metas = {
  types: [],
  demarchesTypes: []
}

const metasInit = async () => {
  metas.types = await typesGet()
  metas.demarchesTypes = await demarchesTypesGet()
}

export default metas

export { metasInit }
