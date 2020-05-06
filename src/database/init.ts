import { metasInit } from './cache/metas'
import { autorisationsInit } from './cache/autorisations'
import { geoConvertInit } from '../tools/geo-convert'
import { globalesInit } from './cache/globales'
import { geoSystemesInit } from './cache/geo-systemes'

const init = async () => {
  await autorisationsInit()
  await metasInit()
  await geoConvertInit()
  await geoSystemesInit()
  await globalesInit()
}

export default init
