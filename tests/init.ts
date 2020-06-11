import * as Knex from 'knex'
import { Model } from 'objection'
import * as path from 'path'
import * as knexDbManager from 'knex-db-manager'
import * as express from 'express'
import { graphql } from '../src/server/graphql'
import { authJwt } from '../src/server/auth-jwt'

import * as knexConfig from '../knex/config'

const dbManager = knexDbManager.databaseManagerFactory({
  knex: knexConfig,
  dbManager: {
    superUser: knexConfig.connection.user,
    superPassword: knexConfig.connection.password,
    populatePathPattern: path.join(__dirname, '../knex/seeds', '0[1-3]-*'),
  },
})

const knex = (dbManager.knexInstance() as unknown) as Knex<any, unknown[]>

Model.knex(knex)

const app = express()

app.use(authJwt)
app.use('/', graphql)

export { knex, dbManager, app, Model }
