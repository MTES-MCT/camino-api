import 'dotenv/config'

import { dbManager } from './init'
import { graphQLCall, queryImport } from './_utils'

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

    expect(res.body.data.domaines).toEqual([
      { id: 'm', nom: 'minéraux et métaux' },
      { id: 'w', nom: 'granulats marins' },
      { id: 'c', nom: 'carrières' },
      { id: 'h', nom: 'hydrocarbures liquides ou gazeux' },
      { id: 'f', nom: 'combustibles fossiles' },
      { id: 'r', nom: 'éléments radioactifs' },
      { id: 'g', nom: 'géothermie' },
      { id: 's', nom: 'stockages souterrains' },
      { id: 'i', nom: 'inconnu' }
    ])
  })
})
