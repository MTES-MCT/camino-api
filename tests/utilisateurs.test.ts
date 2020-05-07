import 'dotenv/config'
import * as fs from 'fs'
import * as path from 'path'
import * as express from 'express'
import * as knexDbManager from 'knex-db-manager'
import * as request from 'supertest'
import * as Knex from 'knex'
import * as jwt from 'jsonwebtoken'
import { Model } from 'objection'

import { graphql } from '../src/server/graphql'
import { authJwt } from '../src/server/auth-jwt'

import * as knexConfig from '../knex/config'
import * as userAdd from '../knex/user-add'

jest.mock('../src/tools/export/utilisateur', () => ({
  __esModule: true,
  utilisateurRowUpdate: jest.fn()
}))

console.info = jest.fn()
console.error = jest.fn()

const knex = Knex(knexConfig)

Model.knex(knex)

const app = express()

app.use(authJwt)
app.use('/', graphql)

// https://github.com/graphql/express-graphql/issues/122

let dbManager: knexDbManager.KnexDbManager

beforeAll(async () => {
  dbManager = knexDbManager.databaseManagerFactory({
    knex: knexConfig,
    dbManager: {
      superUser: knexConfig.connection.user,
      superPassword: knexConfig.connection.password,
      populatePathPattern: path.join(__dirname, '../knex/seeds', '03-*')
    }
  })

  await dbManager.createDbOwnerIfNotExist()

  await dbManager.dropDb(knexConfig.connection.database)
  await dbManager.createDb(knexConfig.connection.database)

  await knex.migrate.latest()

  //  marche mais on préférerait utiliser dbManager
  // await knex.seed.run()
})

afterAll(async () => {
  await Model.knex().destroy()
  await dbManager.closeKnex()
  await dbManager.close()
})

const utilisateurModifierQuery = fs
  .readFileSync(path.join(__dirname, './queries/utilisateur-modifier.graphql'))
  // important pour transformer le buffer en string
  .toString()

describe('utilisateursModifier', () => {
  beforeEach(async () => {
    await dbManager.truncateDb()

    await dbManager.populateDb()

    // const permissions = await knex.select('*').from('permissions')

    await userAdd({
      id: 'test',
      prenom: 'toto',
      nom: 'test',
      email: 'test@camino.local',
      motDePasse: 'mot-de-passe',
      permissionId: 'defaut'
    })
  })

  test("en tant qu'utilisateur anonyme, un utilisateur n'est pas modifié", async () => {
    const res = await request(app)
      .post('/')
      .send({
        query: utilisateurModifierQuery,
        variables: {
          utilisateur: {
            id: 'test',
            prenom: 'toto-updated',
            nom: 'test-updated',
            email: 'test@camino.local',
            permissionId: 'defaut'
          }
        }
      })

    expect(res.body.errors[0].message).toMatch(/droits insuffisants/)
  })

  test("en tant qu'utilisateur, un utilisateur est modifié", async () => {
    const token = jwt.sign({ id: 'test' }, process.env.JWT_SECRET as string)

    const res = await request(app)
      .post('/')
      .send({
        query: utilisateurModifierQuery,
        variables: {
          utilisateur: {
            id: 'test',
            prenom: 'toto-updated',
            nom: 'test-updated',
            email: 'test@camino.local',
            permissionId: 'defaut'
          }
        }
      })
      .set('Authorization', `Bearer ${token}`) //

    expect(res.status).toEqual(200)
    expect(res.body).toMatchObject({
      data: {
        utilisateurModifier: {
          id: 'test'
        }
      }
    })
  })
})
