import { join } from 'path'

import { idGenerate } from '../src/database/models/_format/id-create'
import { knexInstanceSet } from '../src/knex'
import knex, { Knex } from 'knex'
import { Client } from 'pg'
import { knexSnakeCaseMappers, Model } from 'objection'

class DbManager {
  private readonly dbName: string

  public constructor() {
    // jest hack to get a global instance called only once
    this.dbName = process.env.DB_NAME
      ? process.env.DB_NAME
      : `a${idGenerate().toLowerCase()}`
    process.env.DB_NAME = this.dbName
  }

  private static getPgUser() {
    return process.env.PGUSER ?? 'postgres'
  }

  private static getPgPassword() {
    return process.env.PGPASSWORD ?? 'password'
  }

  public async init(): Promise<void> {
    const globalConnection = `postgres://${DbManager.getPgUser()}:${DbManager.getPgPassword()}@localhost/postgres`
    const globalClient = new Client(globalConnection)
    await globalClient.connect()
    const queryResult = await globalClient.query(
      `SELECT 1 FROM pg_database WHERE datname='${this.dbName}'`
    )
    if (queryResult.rowCount === 0) {
      await globalClient.query(`CREATE DATABASE ${this.dbName}`)
    }
    await globalClient.end()

    const knex = this.getKnex()
    await knex.migrate.latest()
    await DbManager.injectSeed(knex)
    await this.closeKnex(knex)
  }

  public getKnex() {
    const knexConfig = {
      client: 'pg',
      connection: {
        host: 'localhost',
        port: 5432,
        database: this.dbName,
        user: DbManager.getPgUser(),
        password: DbManager.getPgPassword()
      },
      migrations: {
        directory: [join(__dirname, '../src/knex/migrations-schema')]
      },
      seeds: {
        directory: join(__dirname, '../src/knex/seeds')
      },
      ...knexSnakeCaseMappers()
    }

    return knex(knexConfig)
  }

  public async populateDb(knex: Knex<any, unknown[]>): Promise<void> {
    this.setGlobally(knex)
    await DbManager.truncateSchema(knex)
    await DbManager.injectSeed(knex)
  }

  public async truncateDb(knex: Knex<any, unknown[]>): Promise<void> {
    await DbManager.truncateSchema(knex)
  }

  public async closeKnex(knex: Knex<any, unknown[]>): Promise<void> {
    await knex.destroy()
  }

  public setGlobally(knex: Knex<any, unknown[]>): void {
    Model.knex(knex)
    knexInstanceSet(knex)
  }

  public async end(): Promise<void> {
    const globalConnection = 'postgres://postgres:password@localhost/postgres'
    const globalClient = new Client(globalConnection)
    await globalClient.connect()
    await globalClient.query(`DROP DATABASE ${this.dbName}`)
    await globalClient.end()
  }

  private static async injectSeed(knex: Knex<any, unknown[]>) {
    await knex.transaction(async trx => trx.seed.run())
  }

  private static async truncateSchema(knex: Knex<any, unknown[]>) {
    const tables =
      (await knex('pg_tables')
        .select('tablename')
        .where('schemaname', 'public')) ?? []

    await knex.raw(
      `TRUNCATE TABLE "${tables
        .filter(table => table.tablename !== 'knex_migrations')
        .map(table => table.tablename)
        .join('","')}"`
    )
  }
}

const dbManager = new DbManager()

export { dbManager }
