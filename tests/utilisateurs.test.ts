import 'dotenv/config'
import * as request from 'supertest'

import { knex, dbManager, app } from './init'
import { queryImport, tokenCreate } from './_utils'
import * as userAdd from '../knex/user-add'

jest.mock('../src/tools/export/utilisateur', () => ({
  __esModule: true,
  utilisateurRowUpdate: jest.fn()
}))

console.info = jest.fn()
console.error = jest.fn()

beforeEach(async () => {
  await dbManager.populateDb()
})

afterEach(async () => {
  await dbManager.truncateDb()
})

describe('utilisateursModifier', () => {
  const utilisateurModifierQuery = queryImport('utilisateur-modifier')

  test('ne peut pas modifier un compte (utilisateur anonyme)', async () => {
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

  test('peut modifier son compte utilisateur', async () => {
    await userAdd(knex, {
      id: 'test',
      prenom: 'toto',
      nom: 'test',
      email: 'test@camino.local',
      motDePasse: 'mot-de-passe',
      permissionId: 'defaut'
    })

    const token = tokenCreate({ id: 'test' })

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
      .set('Authorization', `Bearer ${token}`)

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

describe('utilisateursCreer', () => {
  const utilisateurCreerQuery = queryImport('utilisateur-creer')

  test("ne peut pas créer de compte sans token ou si le token ne contient pas d'email", async () => {
    const res = await request(app)
      .post('/')
      .send({
        query: utilisateurCreerQuery,
        variables: {
          utilisateur: {
            prenom: 'toto',
            nom: 'test',
            email: 'test@camino.local',
            motDePasse: 'mot-de-passe',
            permissionId: 'defaut'
          }
        }
      })

    expect(res.body.errors[0].message).toMatch(
      /droits insuffisants pour créer un utilisateur/
    )
  })

  test('crée son compte si le token contient son email', async () => {
    const token = tokenCreate({ email: 'test@camino.local' })

    const res = await request(app)
      .post('/')
      .send({
        query: utilisateurCreerQuery,
        variables: {
          utilisateur: {
            prenom: 'toto',
            nom: 'test',
            email: 'test@camino.local',
            motDePasse: 'mot-de-passe',
            permissionId: 'defaut'
          }
        }
      })
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toEqual(200)
    expect(res.body).toMatchObject({
      data: {
        utilisateurCreer: {
          prenom: 'toto'
        }
      }
    })
  })

  test("ne peut pas créer de compte 'super' (utilisateur 'defaut')", async () => {
    const token = tokenCreate({ id: 'defaut', email: 'test@camino.local' })

    const res = await request(app)
      .post('/')
      .send({
        query: utilisateurCreerQuery,
        variables: {
          utilisateur: {
            prenom: 'toto',
            nom: 'test',
            email: 'test@camino.local',
            motDePasse: 'mot-de-passe',
            permissionId: 'super'
          }
        }
      })
      .set('Authorization', `Bearer ${token}`)

    expect(res.body.errors[0].message).toMatch(
      /droits insuffisants pour créer un super utilisateur/
    )
  })

  test("peut créer un compte 'super' (utilisateur 'super')", async () => {
    await userAdd(knex, {
      id: 'super-user',
      prenom: 'super',
      nom: 'super',
      email: 'super@camino.local',
      motDePasse: 'mot-de-passe',
      permissionId: 'super'
    })

    const token = tokenCreate({ id: 'super-user' })

    const res = await request(app)
      .post('/')
      .send({
        query: utilisateurCreerQuery,
        variables: {
          utilisateur: {
            prenom: 'toto',
            nom: 'test',
            email: 'test@camino.local',
            motDePasse: 'mot-de-passe',
            permissionId: 'super'
          }
        }
      })
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toEqual(200)
    expect(res.body).toMatchObject({
      data: {
        utilisateurCreer: {
          prenom: 'toto'
        }
      }
    })
  })

  test("ne peut pas être associé à une administration (utilisateur 'defaut')", async () => {
    await userAdd(knex, {
      id: 'super-user',
      prenom: 'super',
      nom: 'super',
      email: 'super@camino.local',
      motDePasse: 'mot-de-passe',
      permissionId: 'super'
    })

    const token = tokenCreate({ id: 'super-user' })

    const res = await request(app)
      .post('/')
      .send({
        query: utilisateurCreerQuery,
        variables: {
          utilisateur: {
            prenom: 'toto',
            nom: 'test',
            email: 'test@camino.local',
            motDePasse: 'mot-de-passe',
            permissionId: 'defaut',
            administrations: [{ id: 'administration' }]
          }
        }
      })
      .set('Authorization', `Bearer ${token}`)

    expect(res.body.errors[0].message).toMatch(
      /les permissions de cet utilisateur ne permettent pas de l'associer à une administration/
    )
  })

  test("est associé à une administrations (utilisateur 'admin')", async () => {
    await userAdd(knex, {
      id: 'super-user',
      prenom: 'super',
      nom: 'super',
      email: 'super@camino.local',
      motDePasse: 'mot-de-passe',
      permissionId: 'super'
    })

    await knex('administrations_types').insert({
      id: 'adm',
      nom: 'admin',
      ordre: 1
    })

    await knex('administrations').insert({
      id: 'administration',
      nom: 'admin',
      typeId: 'adm'
    })

    const token = tokenCreate({ id: 'super-user' })

    const res = await request(app)
      .post('/')
      .send({
        query: utilisateurCreerQuery,
        variables: {
          utilisateur: {
            prenom: 'toto',
            nom: 'test',
            email: 'test@camino.local',
            motDePasse: 'mot-de-passe',
            permissionId: 'admin',
            administrations: [{ id: 'administration' }]
          }
        }
      })
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toEqual(200)
    expect(res.body).toMatchObject({
      data: {
        utilisateurCreer: {
          prenom: 'toto'
        }
      }
    })
  })
  test("ne peut pas être associé à une entreprise (utilisateur 'defaut')", async () => {
    await userAdd(knex, {
      id: 'super-user',
      prenom: 'super',
      nom: 'super',
      email: 'super@camino.local',
      motDePasse: 'mot-de-passe',
      permissionId: 'super'
    })

    const token = tokenCreate({ id: 'super-user' })

    const res = await request(app)
      .post('/')
      .send({
        query: utilisateurCreerQuery,
        variables: {
          utilisateur: {
            prenom: 'toto',
            nom: 'test',
            email: 'test@camino.local',
            motDePasse: 'mot-de-passe',
            permissionId: 'defaut',
            entreprises: [{ id: 'entreprise' }]
          }
        }
      })
      .set('Authorization', `Bearer ${token}`)

    expect(res.body.errors[0].message).toMatch(
      /les permissions de cet utilisateur ne permettent pas de l'associer à une entreprise/
    )
  })

  test("peut être associé à une entreprise (utilisateur 'entreprise')", async () => {
    await userAdd(knex, {
      id: 'super-user',
      prenom: 'super',
      nom: 'super',
      email: 'super@camino.local',
      motDePasse: 'mot-de-passe',
      permissionId: 'super'
    })

    await knex('entreprises').insert({
      id: 'entreprise',
      nom: 'entre'
    })

    const token = tokenCreate({ id: 'super-user' })

    const res = await request(app)
      .post('/')
      .send({
        query: utilisateurCreerQuery,
        variables: {
          utilisateur: {
            prenom: 'toto',
            nom: 'test',
            email: 'test@camino.local',
            motDePasse: 'mot-de-passe',
            permissionId: 'entreprise',
            entreprises: [{ id: 'entreprise' }]
          }
        }
      })
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toEqual(200)
    expect(res.body).toMatchObject({
      data: {
        utilisateurCreer: {
          prenom: 'toto'
        }
      }
    })
  })
})
