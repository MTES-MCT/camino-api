import { dbManager } from './db-manager'
import { graphQLCall, queryImport } from './_utils/index'
import Utilisateurs from '../src/database/models/utilisateurs'

console.info = jest.fn()
console.error = jest.fn()
const knex = dbManager.getKnex()
beforeAll(async () => {
  await dbManager.populateDb(knex)
})

afterAll(async () => {
  await dbManager.truncateDb(knex)
  await dbManager.closeKnex(knex)
})

describe('utilisateurConnecter', () => {
  const utilisateurConnecterQuery = queryImport('utilisateur-connecter')

  test('un utilisateur inconnu ne peut pas se connecter (anonyme)', async () => {
    const res = await graphQLCall(utilisateurConnecterQuery, {
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

    const res = await graphQLCall(utilisateurConnecterQuery, {
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

    const res = await graphQLCall(utilisateurConnecterQuery, {
      email: 'tototot@tototot.to',
      motDePasse: 'coucoucou'
    })

    expect(res.body.errors).toBeUndefined()
    const setCookies = res.get('Set-Cookie')
    expect(setCookies.find(c => c.startsWith('accessToken'))).toBeDefined()
    expect(setCookies.find(c => c.startsWith('refreshToken'))).toBeDefined()

    const userInDB = await Utilisateurs.query()
      .findById(res.body.data.utilisateurConnecter.id)
      .execute()

    expect(setCookies.find(c => c.startsWith('refreshToken'))).toContain(
      userInDB!.refreshToken
    )
  })
})
