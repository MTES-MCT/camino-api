import { metasInit } from './cache/metas'
import { globalesInit } from './cache/globales'
import { geoSystemesInit } from './cache/geo-systemes'
import { knex } from '../knex'
import { CustomMigrationSource } from '../knex/migrationSource'
import { knexConfig } from '../knex/config'

const migratorConfiguration = {
  migrationSource: new CustomMigrationSource(knexConfig.migrations.directory)
}

const databaseInit = async () => {
  await knex.migrate.latest(migratorConfiguration)
  await cacheInit()
}

const cacheInit = async () => {
  await metasInit()
  await globalesInit()
  await geoSystemesInit()
}

export { databaseInit, cacheInit }
