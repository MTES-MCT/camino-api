import { IDevise, IUnite } from '../../types'

import { devisesGet, unitesGet } from '../queries/metas'

const metas = {
  devises: [] as IDevise[],
  unites: [] as IUnite[]
}

const metasInit = async () => {
  // utilisés pour la validation des sections d'étapes
  // /src/api/resolvers/format/titres-sections
  metas.devises = await devisesGet()
  metas.unites = await unitesGet()
}

const metasGet = (metaName: 'devises' | 'unites') => metas[metaName]

export { metasInit, metasGet }
