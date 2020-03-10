import { IDevise, IUnite, IEtapeType, IForet } from '../../types'

import { devisesGet, unitesGet, etapesTypesGet } from '../queries/metas'

import {
  foretsGet
} from '../queries/territoires'

const metas = {
  devises: [] as IDevise[],
  unites: [] as IUnite[],
  etapesTypes: [] as IEtapeType[],
  forets: [] as IForet[]
}

const metasInit = async () => {
  // utilisés pour la validation des sections d'étapes
  // /src/api/resolvers/format/titres-sections.ts
  metas.devises = await devisesGet()
  metas.unites = await unitesGet()
  metas.etapesTypes = await etapesTypesGet(
    {},
    { fields: { etapesStatuts: { id: {} } } },
    'super'
  )
  metas.forets = await foretsGet()
}

export default metas

export { metasInit }
