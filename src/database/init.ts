import { metasInit } from './cache/metas'
import { globalesInit } from './cache/globales'
import { geoSystemesInit } from './cache/geo-systemes'
import { knex } from '../knex'

const databaseInit = async () => {
  await knex.migrate.latest()
  await cacheInit()
}

const cacheInit = async () => {
  await metasInit()
  await globalesInit()
  await geoSystemesInit()
}

export { databaseInit, cacheInit }
