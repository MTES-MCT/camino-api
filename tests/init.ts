import 'dotenv/config'
import * as Knex from 'knex'
import { Model } from 'objection'
import * as path from 'path'
import * as knexDbManager from 'knex-db-manager'
import * as express from 'express'
import { graphql } from '../src/server/graphql'
import { authJwt } from '../src/server/auth-jwt'

import { knexConfig } from '../knex/config'
import { knexInstanceSet } from '../src/knex'

const dbManager = knexDbManager.databaseManagerFactory({
  knex: knexConfig,
  dbManager: {
    superUser: knexConfig.connection.user,
    superPassword: knexConfig.connection.password,
    populatePathPattern: path.join(__dirname, '../knex/seeds', '0[1-9]*.js')
  }
})

knexInstanceSet((dbManager.knexInstance() as unknown) as Knex<any, unknown[]>)

const app = express()

app.use(authJwt)
app.use('/', graphql)

export { dbManager, app, Model }
