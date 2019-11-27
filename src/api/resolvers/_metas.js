import { typesGet, demarchesTypesGet } from '../../database/queries/metas'

const metas = {
  types: [],
  demarchesTypes: []
}

const init = async () => {
  metas.types = await typesGet()
  metas.demarchesTypes = await demarchesTypesGet()
}

export default metas

init()
