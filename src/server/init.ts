import { metasInit } from '../database/cache/metas'
import { autorisationsInit } from '../database/cache/autorisations'
import { geoConvertInit } from '../tools/geo-convert'
import { globalesInit } from '../database/cache/globales'
import { geoSystemesInit } from '../database/cache/geo-systemes'

const init = async () => {
  await autorisationsInit()
  await metasInit()
  await geoConvertInit()
  await geoSystemesInit()
  await globalesInit()
}

export default init
