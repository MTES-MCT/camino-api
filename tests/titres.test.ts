import 'dotenv/config'
import * as request from 'supertest'

import { knex, dbManager, app } from './init'
import { queryImport, tokenCreate } from './_utils'
import * as userAdd from '../knex/user-add'

console.info = jest.fn()
console.error = jest.fn()

// https://github.com/graphql/express-graphql/issues/122

beforeEach(async () => {
  await dbManager.populateDb()
})

afterEach(async () => {
  await dbManager.truncateDb()
})

afterAll(async () => {
  dbManager.closeKnex()
})

describe('titreCreer', () => {
  const titreCreerQuery = queryImport('titre-creer')

  test('ne peut pas créer un titre (utilisateur anonyme)', async () => {
    const res = await request(app)
      .post('/')
      .send({
        query: titreCreerQuery,
        variables: {
          titre: { nom: 'titre', typeId: 'aph', domaineId: 'h' }
        }
      })

    expect(res.body.errors[0].message).toMatch(/droits insuffisants/)
  })

  test("crée un titre (un utilisateur 'super')", async () => {
    jest.setTimeout(20000)

    await userAdd(knex, {
      id: 'super-user',
      prenom: 'toto',
      nom: 'test',
      email: 'test@camino.local',
      motDePasse: 'mot-de-passe',
      permissionId: 'super'
    })

    const token = tokenCreate({ id: 'super-user' })

    const res = await request(app)
      .post('/')
      .send({
        query: titreCreerQuery,
        variables: {
          titre: { nom: 'titre', typeId: 'aph', domaineId: 'h' }
        }
      })
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toEqual(200)
    expect(res.body).toMatchObject({
      data: {
        titreCreer: {
          id: 'h-ap-titre-0000',
          nom: 'titre'
        }
      }
    })
  })
})
