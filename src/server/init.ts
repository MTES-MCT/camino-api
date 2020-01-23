import { metasInit } from '../api/resolvers/_metas'
import { restrictionsInit } from '../api/resolvers/_restrictions'
import { geoConvertInit } from '../tools/geo-convert'
import { globalesInit } from './globales'

const init = async () => {
  await restrictionsInit()
  await metasInit()
  await geoConvertInit()
  await globalesInit()
}

export default init
