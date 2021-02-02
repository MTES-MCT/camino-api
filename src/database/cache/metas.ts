import { IDevise, IUnite, IEtapeType } from '../../types'

import { devisesGet, unitesGet, etapesTypesGet } from '../queries/metas'

const metas = {
  devises: [] as IDevise[],
  unites: [] as IUnite[],
  etapesTypes: [] as IEtapeType[]
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
}

const metasGet = (metaName: 'devises' | 'unites' | 'etapesTypes') =>
  metas[metaName]

export { metasInit, metasGet }
