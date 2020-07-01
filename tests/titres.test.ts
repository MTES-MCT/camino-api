import 'dotenv/config'

import { IAdministration, IUtilisateur } from '../src/types'

import { dbManager } from './init'
import {
  graphQLCall,
  queryImport,
  tokenCreate,
  tokenUserGenerate
} from './_utils'
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
    const res = await graphQLCall(titreCreerQuery, {
      titre: { nom: 'titre', typeId: 'arm', domaineId: 'm' }
    })

    expect(res.body.errors[0].message).toMatch(/droits insuffisants/)
  })

  test("ne peut pas créer un titre (un utilisateur 'entreprise')", async () => {
    const token = await tokenUserGenerate('entreprise')
    const res = await graphQLCall(
      titreCreerQuery,
      {
        titre: { nom: 'titre', typeId: 'arm', domaineId: 'm' }
      },
      token
    )

    expect(res.body.errors[0].message).toMatch(/droits insuffisants/)
  })

  test("crée un titre (un utilisateur 'super')", async () => {
    const token = await tokenUserGenerate('super')
    const res = await graphQLCall(
      titreCreerQuery,
      {
        titre: { nom: 'titre', typeId: 'arm', domaineId: 'm' }
      },
      token
    )

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

    const res = await graphQLCall(
      titreCreerQuery,
      {
        titre: { nom: 'titre', typeId: 'axm', domaineId: 'm' }
      },
      token
    )

    expect(res.body.errors[0].message).toMatch(
      /droits insuffisants pour créer ce type de titre/
    )
  })

  test("crée un titre ARM (un utilisateur 'admin' PTMG)", async () => {
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

    const res = await graphQLCall(
      titreCreerQuery,
      {
        titre: { nom: 'titre', typeId: 'arm', domaineId: 'm' }
      },
      token
    )

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
    const res = await graphQLCall(titreModifierQuery, {
      titre: { id, nom: 'mon titre modifié', typeId: 'arm', domaineId: 'm' }
    })

    expect(res.body.errors[0].message).toMatch(/le titre n'existe pas/)
  })

  test("ne peut pas modifier un titre (un utilisateur 'entreprise')", async () => {
    const token = await tokenUserGenerate('entreprise')
    const res = await graphQLCall(
      titreModifierQuery,
      {
        titre: { id, nom: 'mon titre modifié', typeId: 'arm', domaineId: 'm' }
      },
      token
    )

    expect(res.body.errors[0].message).toMatch(/le titre n'existe pas/)
  })

  test("modifie un titre (un utilisateur 'super')", async () => {
    const token = await tokenUserGenerate('super')
    const res = await graphQLCall(
      titreModifierQuery,
      {
        titre: { id, nom: 'mon titre modifié', typeId: 'arm', domaineId: 'm' }
      },
      token
    )

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

    const res = await graphQLCall(
      titreModifierQuery,
      {
        titre: { id, nom: 'mon titre modifié', typeId: 'arm', domaineId: 'm' }
      },
      token
    )

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

    const res = await graphQLCall(
      titreModifierQuery,
      {
        titre: {
          id: 'titre-arm-echu',
          nom: 'mon titre échu modifié',
          typeId: 'arm',
          domaineId: 'm'
        }
      },
      token
    )

    expect(res.body.errors[0].message).toMatch(
      /droits insuffisants pour modifier ce type de titre/
    )
  })

  test("ne peut pas modifier un titre ARM (un utilisateur 'admin' DGTM)", async () => {
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

    const res = await graphQLCall(
      titreModifierQuery,
      {
        titre: { id, nom: 'mon titre modifié', typeId: 'arm', domaineId: 'm' }
      },
      token
    )

    expect(res.body.errors[0].message).toMatch(
      /droits insuffisants pour modifier ce type de titre/
    )
  })
})

describe('titreSupprimer', () => {
  const titreSupprimerQuery = queryImport('titre-supprimer')

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

  test('ne peut pas supprimer un titre (utilisateur anonyme)', async () => {
    const res = await graphQLCall(titreSupprimerQuery, {
      id
    })
    expect(res.body.errors[0].message).toMatch(/droits insuffisants/)
  })

  test('peut supprimer un titre (utilisateur super)', async () => {
    const token = await tokenUserGenerate('super')
    const res = await graphQLCall(
      titreSupprimerQuery,
      {
        id
      },
      token
    )

    expect(res.body).toMatchObject({
      data: {
        titreSupprimer: {
          id
        }
      }
    })
  })

  test('ne peut pas supprimer un titre inexistant (utilisateur super)', async () => {
    const token = await tokenUserGenerate('super')
    const res = await graphQLCall(
      titreSupprimerQuery,
      {
        id: 'toto'
      },
      token
    )

    expect(res.body.errors[0].message).toMatch(/aucun titre avec cet id/)
  })
})
