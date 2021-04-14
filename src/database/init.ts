import { metasInit } from './cache/metas'
import { globalesInit } from './cache/globales'
import { geoSystemesInit } from './cache/geo-systemes'

const databaseInit = async () => {
  await metasInit()
  await globalesInit()
  await geoSystemesInit()
}

export { databaseInit }
