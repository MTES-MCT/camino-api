import { dbManager } from './init-db-manager'
import { graphQLCall, queryImport } from './_utils/index'
import Utilisateurs from '../src/database/models/utilisateurs'
import * as jwt from 'jsonwebtoken'

console.info = jest.fn()
console.error = jest.fn()

beforeEach(async () => {
  await dbManager.populateDb()
})

afterEach(async () => {
  await dbManager.truncateDb()
})

afterAll(async () => {
  dbManager.closeKnex()
})

describe('utilisateurTokenCreer', () => {
  const utilisateurTokenCreerQuery = queryImport('token-creer')

  test('un utilisateur inconnu ne peut pas se connecter (anonyme)', async () => {
    const res = await graphQLCall(utilisateurTokenCreerQuery, {
      email: 'tototot@tototot.to',
      motDePasse: 'coucou'
    })

    expect(res.body.errors[0].message).toBe(
      'aucun utilisateur enregistré avec cette adresse email'
    )
  })

  test('un utilisateur connu avec mauvais mot de passe ne peut pas se connecter (anonyme)', async () => {
    await graphQLCall(
      queryImport('utilisateur-creer'),
      {
        utilisateur: {
          email: 'tototot@tototot.to',
          motDePasse: 'coucoucou',
          nom: 'nom',
          prenom: 'prenom'
        }
      },
      'super'
    )

    const res = await graphQLCall(utilisateurTokenCreerQuery, {
      email: 'tototot@tototot.to',
      motDePasse: 'coucou'
    })

    expect(res.body.errors[0].message).toBe('mot de passe incorrect')
  })

  test('un utilisateur connu avec le bon mot de passe peut se connecter (anonyme)', async () => {
    await graphQLCall(
      queryImport('utilisateur-creer'),
      {
        utilisateur: {
          email: 'tototot@tototot.to',
          motDePasse: 'coucoucou',
          nom: 'nom',
          prenom: 'prenom'
        }
      },
      'super'
    )

    const res = await graphQLCall(utilisateurTokenCreerQuery, {
      email: 'tototot@tototot.to',
      motDePasse: 'coucoucou'
    })

    expect(res.body.errors).toBeUndefined()
    expect(res.body.data.utilisateurTokenCreer.accessToken).toBeDefined()
    expect(res.body.data.utilisateurTokenCreer.refreshToken).toBeDefined()

    const userInDB = await Utilisateurs.query()
      .findById(res.body.data.utilisateurTokenCreer.utilisateur.id)
      .execute()

    expect(res.body.data.utilisateurTokenCreer.refreshToken).toBe(
      userInDB.refreshToken
    )
  })
})
describe('utilisateurTokenRafraichir', () => {
  const utilisateurTokenRafraichirQuery = queryImport('token-rafraichir')

  test('ne peut pas rafraichir un token si le refresh token est invalide (anonyme)', async () => {
    const res = await graphQLCall(utilisateurTokenRafraichirQuery, {
      refreshToken: 'totototo'
    })

    expect(res.body.errors[0].message).toBe('jwt malformed')
  })

  test('ne peut pas rafraichir un token si le refresh token est valide mais inconnu (anonyme)', async () => {
    const refreshToken = jwt.sign(
      { id: '1', email: 'toto@toto.fr' },
      process.env.JWT_SECRET_REFRESH!
    )
    const res = await graphQLCall(utilisateurTokenRafraichirQuery, {
      refreshToken
    })

    expect(res.body.errors[0].message).toBe('refresh token inconnu')
  })

  test('peut rafraichir un token si le refresh token est valide et connu (anonyme)', async () => {
    await graphQLCall(
      queryImport('utilisateur-creer'),
      {
        utilisateur: {
          email: 'tototot@tototot.to',
          motDePasse: 'coucoucou',
          nom: 'nom',
          prenom: 'prenom'
        }
      },
      'super'
    )

    let res = await graphQLCall(queryImport('token-creer'), {
      email: 'tototot@tototot.to',
      motDePasse: 'coucoucou'
    })

    res = await graphQLCall(utilisateurTokenRafraichirQuery, {
      refreshToken: res.body.data.utilisateurTokenCreer.refreshToken
    })

    expect(res.body.errors).toBeUndefined()
  })
})
