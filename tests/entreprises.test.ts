import 'dotenv/config'

import { dbManager } from './init'
import { graphQLCall, queryImport } from './_utils'
import { autorisationsInit } from '../src/database/cache/autorisations'
import { mocked } from 'ts-jest/utils'
import {
  entreprisesEtablissementsFetch,
  entreprisesFetch,
  tokenInitialize
} from '../src/tools/api-insee/fetch'
import {
  entreprise,
  entrepriseAndEtablissements
} from './__mocks__/fetch-insee-api'

console.info = jest.fn()
console.error = jest.fn()

jest.mock('../src/tools/api-insee/fetch', () => ({
  __esModule: true,
  tokenInitialize: jest.fn(),
  entreprisesFetch: jest.fn(),
  entreprisesEtablissementsFetch: jest.fn()
}))

const tokenInitializeMock = mocked(tokenInitialize, true)
const entrepriseFetchMock = mocked(entreprisesFetch, true)
const entreprisesEtablissementsFetchMock = mocked(
  entreprisesEtablissementsFetch,
  true
)

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

describe('entrepriseCreer', () => {
  const entrepriseCreerQuery = queryImport('entreprise-creer')

  test('ne peut pas créer une entreprise (utilisateur anonyme)', async () => {
    const res = await graphQLCall(entrepriseCreerQuery, {
      entreprise: { legalSiren: 'test', paysId: 'fr' }
    })

    expect(res.body.errors[0].message).toBe(
      'droits insuffisants pour effectuer cette opération'
    )
  })

  test("peut créer une entreprise (un utilisateur 'super')", async () => {
    tokenInitializeMock.mockResolvedValue('token')
    entrepriseFetchMock.mockResolvedValue([entreprise])
    entreprisesEtablissementsFetchMock.mockResolvedValue([
      entrepriseAndEtablissements
    ])

    const res = await graphQLCall(
      entrepriseCreerQuery,
      {
        entreprise: { legalSiren: '729800706', paysId: 'fr' }
      },
      'super'
    )

    expect(res.body).toMatchObject({
      data: {
        entrepriseCreer: {
          legalSiren: '729800706'
        }
      }
    })
    expect(res.body.errors).toBeUndefined()
  })

  test("ne peut pas créer une entreprise déjà existante (un utilisateur 'super')", async () => {
    await graphQLCall(
      entrepriseCreerQuery,
      {
        entreprise: { legalSiren: '729800706', paysId: 'fr' }
      },
      'super'
    )

    const res = await graphQLCall(
      entrepriseCreerQuery,
      {
        entreprise: { legalSiren: '729800706', paysId: 'fr' }
      },
      'super'
    )

    expect(res.body.errors[0].message).toBe(
      "l'entreprise PLACOPLATRE existe déjà dans Camino"
    )
  })

  test("ne peut pas créer une entreprise avec un siren invalide (un utilisateur 'super')", async () => {
    tokenInitializeMock.mockResolvedValue('token')
    entrepriseFetchMock.mockResolvedValue([])

    const res = await graphQLCall(
      entrepriseCreerQuery,
      {
        entreprise: { legalSiren: 'invalid', paysId: 'fr' }
      },
      'super'
    )

    expect(res.body.errors[0].message).toBe(
      'numéro de siren non reconnu dans la base Insee'
    )
  })

  test("ne peut pas créer une entreprise étrangère (un utilisateur 'super')", async () => {
    const res = await graphQLCall(
      entrepriseCreerQuery,
      {
        entreprise: { legalSiren: '729800706', paysId: 'en' }
      },
      'super'
    )

    expect(res.body.errors[0].message).toBe(
      'impossible de créer une entreprise étrangère'
    )
  })
})

describe('entrepriseModifier', () => {
  const entrepriseModifierQuery = queryImport('entreprise-modifier')

  let entrepriseId: string

  beforeEach(async () => {
    tokenInitializeMock.mockResolvedValue('token')
    entrepriseFetchMock.mockResolvedValue([entreprise])
    entreprisesEtablissementsFetchMock.mockResolvedValue([
      entrepriseAndEtablissements
    ])

    const res = await graphQLCall(
      queryImport('entreprise-creer'),
      {
        entreprise: { legalSiren: '729800706', paysId: 'fr' }
      },
      'super'
    )

    entrepriseId = res.body.data.entrepriseCreer.id
  })

  test('ne peut pas modifier une entreprise (utilisateur anonyme)', async () => {
    const res = await graphQLCall(entrepriseModifierQuery, {
      entreprise: { id: entrepriseId, email: 'toto@gmail.com' }
    })

    expect(res.body.errors[0].message).toBe(
      'droits insuffisants pour effectuer cette opération'
    )
  })

  test("peut modifier une entreprise (un utilisateur 'super')", async () => {
    const res = await graphQLCall(
      entrepriseModifierQuery,
      {
        entreprise: { id: entrepriseId, email: 'toto@gmail.com' }
      },
      'super'
    )

    expect(res.body).toMatchObject({
      data: {
        entrepriseModifier: {
          email: 'toto@gmail.com'
        }
      }
    })
    expect(res.body.errors).toBeUndefined()
  })

  test("ne peut pas modifier une entreprise avec un email invalide (un utilisateur 'super')", async () => {
    const res = await graphQLCall(
      entrepriseModifierQuery,
      {
        entreprise: { id: entrepriseId, email: 'totogmail.com' }
      },
      'super'
    )

    expect(res.body.errors[0].message).toBe('adresse email invalide')
  })

  test("ne peut pas modifier une entreprise inexistante (un utilisateur 'super')", async () => {
    const res = await graphQLCall(
      entrepriseModifierQuery,
      {
        entreprise: { id: 'id-inconnu' }
      },
      'super'
    )

    expect(res.body.errors[0].message).toBe('entreprise inconnue')
  })
})
