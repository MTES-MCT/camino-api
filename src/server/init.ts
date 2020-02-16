import { metasInit } from '../database/cache/metas'
import { restrictionsInit } from '../database/cache/restrictions'
import { geoConvertInit } from '../tools/geo-convert'
import { globalesInit } from '../database/cache/globales'
import { geoSystemesInit } from '../database/cache/geo-systemes'

const init = async () => {
  await restrictionsInit()
  await metasInit()
  await geoConvertInit()
  await geoSystemesInit()
  await globalesInit()
}

export default init
