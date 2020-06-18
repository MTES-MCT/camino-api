import 'dotenv/config'
import * as request from 'supertest'

import { IAdministration, IUtilisateur } from '../src/types'

import { knex, dbManager, app } from './init'
import { queryImport, tokenCreate } from './_utils'
import * as userAdd from '../knex/user-add'
import { utilisateurCreate } from '../src/database/queries/utilisateurs'
import { autorisationsInit } from '../src/database/cache/autorisations'

console.info = jest.fn()
console.error = jest.fn()

// https://github.com/graphql/express-graphql/issues/122

beforeEach(async () => {
  await dbManager.populateDb()
  await autorisationsInit()
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

  test("ne peut créer un titre (un utilisateur 'entreprise')", async () => {
    jest.setTimeout(20000)

    await userAdd(knex, {
      id: 'entreprise-user',
      prenom: 'toto',
      nom: 'test',
      email: 'test@camino.local',
      motDePasse: 'mot-de-passe',
      permissionId: 'entreprise'
    })

    const token = tokenCreate({ id: 'entreprise-user' })

    const res = await request(app)
      .post('/')
      .send({
        query: titreCreerQuery,
        variables: {
          titre: { nom: 'titre', typeId: 'aph', domaineId: 'h' }
        }
      })
      .set('Authorization', `Bearer ${token}`)

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

    expect(res.body).toMatchObject({
      data: {
        titreCreer: {
          id: 'h-ap-titre-0000',
          nom: 'titre'
        }
      }
    })
  })

  test("ne peut pas créer un titre ARM (un utilisateur 'admin' DGTM Guyane)", async () => {
    jest.setTimeout(20000)

    await utilisateurCreate(
      ({
        id: 'admin-user',
        prenom: 'toto',
        nom: 'test',
        email: 'test@camino.local',
        motDePasse: 'mot-de-passe',
        permissionId: 'admin',
        administrations: [
          ({ id: 'dea-guyane-01' } as unknown) as IAdministration
        ]
      } as unknown) as IUtilisateur,
      {}
    )

    const token = tokenCreate({ id: 'admin-user' })

    const res = await request(app)
      .post('/')
      .send({
        query: titreCreerQuery,
        variables: {
          titre: { nom: 'titre', typeId: 'arm', domaineId: 'm' }
        }
      })
      .set('Authorization', `Bearer ${token}`)

    expect(res.body.errors[0].message).toMatch(
      /droits insuffisants pour créer ce type de titre/
    )
  })

  test("crée un titre AXM (un utilisateur 'admin' DGTM Guyane)", async () => {
    jest.setTimeout(20000)

    await utilisateurCreate(
      ({
        id: 'admin-user',
        prenom: 'toto',
        nom: 'test',
        email: 'test@camino.local',
        motDePasse: 'mot-de-passe',
        permissionId: 'admin',
        administrations: [
          ({ id: 'dea-guyane-01' } as unknown) as IAdministration
        ]
      } as unknown) as IUtilisateur,
      {}
    )

    const token = tokenCreate({ id: 'admin-user' })

    const res = await request(app)
      .post('/')
      .send({
        query: titreCreerQuery,
        variables: {
          titre: { nom: 'titre', typeId: 'axm', domaineId: 'm' }
        }
      })
      .set('Authorization', `Bearer ${token}`)

    expect(res.body).toMatchObject({
      data: {
        titreCreer: {
          id: 'm-ax-titre-0000',
          nom: 'titre'
        }
      }
    })
  })
})
