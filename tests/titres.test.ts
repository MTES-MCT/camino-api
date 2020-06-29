import 'dotenv/config'
import * as request from 'supertest'

import { IAdministration, IUtilisateur } from '../src/types'

import { knex, dbManager, app } from './init'
import { queryImport, tokenCreate } from './_utils'
import * as userAdd from '../knex/user-add'
import { utilisateurCreate } from '../src/database/queries/utilisateurs'
import { autorisationsInit } from '../src/database/cache/autorisations'
import { titreCreate } from '../src/database/queries/titres'

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
          titre: { nom: 'titre', typeId: 'arm', domaineId: 'm' }
        }
      })

    expect(res.body.errors[0].message).toMatch(/droits insuffisants/)
  })

  test("ne peut pas créer un titre (un utilisateur 'entreprise')", async () => {
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
          titre: { nom: 'titre', typeId: 'arm', domaineId: 'm' }
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
          titre: { nom: 'titre', typeId: 'arm', domaineId: 'm' }
        }
      })
      .set('Authorization', `Bearer ${token}`)

    expect(res.body).toMatchObject({
      data: {
        titreCreer: {
          id: 'm-ar-titre-0000',
          nom: 'titre'
        }
      }
    })
  })

  test("ne peut pas créer un titre AXM (un utilisateur 'admin' PTMG)", async () => {
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
          ({ id: 'ope-ptmg-973-01' } as unknown) as IAdministration
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

    expect(res.body.errors[0].message).toMatch(
      /droits insuffisants pour créer ce type de titre/
    )
  })

  test("crée un titre ARM (un utilisateur 'admin' PTMG)", async () => {
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
          ({ id: 'ope-ptmg-973-01' } as unknown) as IAdministration
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

    expect(res.body).toMatchObject({
      data: {
        titreCreer: {
          id: 'm-ar-titre-0000',
          nom: 'titre'
        }
      }
    })
  })
})

describe('titreModifier', () => {
  const titreModifierQuery = queryImport('titre-modifier')

  const id = 'titre-arm'

  beforeEach(async () => {
    await titreCreate(
      {
        id,
        nom: 'mon titre',
        domaineId: 'm',
        typeId: 'arm'
      },
      {},
      'super'
    )
  })

  test('ne peut pas modifier un titre (utilisateur anonyme)', async () => {
    const res = await request(app)
      .post('/')
      .send({
        query: titreModifierQuery,
        variables: {
          titre: { id, nom: 'mon titre modifié', typeId: 'arm', domaineId: 'm' }
        }
      })

    expect(res.body.errors[0].message).toMatch(/le titre n'existe pas/)
  })

  test("ne peut pas modifier un titre (un utilisateur 'entreprise')", async () => {
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
        query: titreModifierQuery,
        variables: {
          titre: { id, nom: 'mon titre modifié', typeId: 'arm', domaineId: 'm' }
        }
      })
      .set('Authorization', `Bearer ${token}`)

    expect(res.body.errors[0].message).toMatch(/le titre n'existe pas/)
  })

  test("modifie un titre (un utilisateur 'super')", async () => {
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
        query: titreModifierQuery,
        variables: {
          titre: { id, nom: 'mon titre modifié', typeId: 'arm', domaineId: 'm' }
        }
      })
      .set('Authorization', `Bearer ${token}`)

    expect(res.body).toMatchObject({
      data: {
        titreModifier: {
          id: 'm-ar-mon-titre-modifie-0000',
          nom: 'mon titre modifié'
        }
      }
    })
  })

  test("modifie un titre ARM (un utilisateur 'admin' PTMG)", async () => {
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
          ({ id: 'ope-ptmg-973-01' } as unknown) as IAdministration
        ]
      } as unknown) as IUtilisateur,
      {}
    )

    const token = tokenCreate({ id: 'admin-user' })

    const res = await request(app)
      .post('/')
      .send({
        query: titreModifierQuery,
        variables: {
          titre: { id, nom: 'mon titre modifié', typeId: 'arm', domaineId: 'm' }
        }
      })
      .set('Authorization', `Bearer ${token}`)

    expect(res.body).toMatchObject({
      data: {
        titreModifier: {
          id: 'm-ar-mon-titre-modifie-0000',
          nom: 'mon titre modifié'
        }
      }
    })
  })

  test("ne peut pas modifier un titre ARM échu (un utilisateur 'admin' PTMG)", async () => {
    jest.setTimeout(20000)

    await titreCreate(
      {
        id: 'titre-arm-echu',
        nom: 'mon titre échu',
        domaineId: 'm',
        typeId: 'arm',
        statutId: 'ech'
      },
      {},
      'super'
    )

    await utilisateurCreate(
      ({
        id: 'admin-user',
        prenom: 'toto',
        nom: 'test',
        email: 'test@camino.local',
        motDePasse: 'mot-de-passe',
        permissionId: 'admin',
        administrations: [
          ({ id: 'ope-ptmg-973-01' } as unknown) as IAdministration
        ]
      } as unknown) as IUtilisateur,
      {}
    )

    const token = tokenCreate({ id: 'admin-user' })

    const res = await request(app)
      .post('/')
      .send({
        query: titreModifierQuery,
        variables: {
          titre: {
            id: 'titre-arm-echu',
            nom: 'mon titre échu modifié',
            typeId: 'arm',
            domaineId: 'm'
          }
        }
      })
      .set('Authorization', `Bearer ${token}`)

    expect(res.body.errors[0].message).toMatch(
      /droits insuffisants pour modifier ce type de titre/
    )
  })

  test("ne peut pas modifier un titre ARM (un utilisateur 'admin' DGTM)", async () => {
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
        query: titreModifierQuery,
        variables: {
          titre: { id, nom: 'mon titre modifié', typeId: 'arm', domaineId: 'm' }
        }
      })
      .set('Authorization', `Bearer ${token}`)

    expect(res.body.errors[0].message).toMatch(
      /droits insuffisants pour modifier ce type de titre/
    )
  })
})
