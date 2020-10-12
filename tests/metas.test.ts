import 'dotenv/config'

import { dbManager } from './init'
import { graphQLCall, queryImport } from './_utils'
import { autorisationsInit } from '../src/database/cache/autorisations'

console.info = jest.fn()
console.error = jest.fn()

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

describe('statuts', () => {
  const metasQuery = queryImport('metas')

  test('peut voir tous les statuts (utilisateur super)', async () => {
    const res = await graphQLCall(metasQuery, {}, 'super')

    expect(res.body.data.statuts).toEqual([
      { id: 'dmi', nom: 'demande initiale', couleur: 'warning' },
      { id: 'dmc', nom: 'demande classée', couleur: 'neutral' },
      { id: 'val', nom: 'valide', couleur: 'success' },
      { id: 'mod', nom: 'modification en instance', couleur: 'warning' },
      { id: 'ech', nom: 'échu', couleur: 'neutral' },
      { id: 'ind', nom: 'indéterminé', couleur: 'warning' }
    ])
  })

  test('ne peut pas voir tous les statuts (utilisateur anonyme)', async () => {
    const res = await graphQLCall(metasQuery, {})

    expect(res.body.data.statuts).toEqual([
      { id: 'dmi', nom: 'demande initiale', couleur: 'warning' },
      { id: 'dmc', nom: 'demande classée', couleur: 'neutral' },
      { id: 'val', nom: 'valide', couleur: 'success' },
      { id: 'mod', nom: 'modification en instance', couleur: 'warning' },
      { id: 'ech', nom: 'échu', couleur: 'neutral' }
    ])
  })
})
