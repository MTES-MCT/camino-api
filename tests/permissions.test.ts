import 'dotenv/config'

import { dbManager } from './init'
import { graphQLCall, queryImport } from './_utils'
import { scenariosGet } from './__mocks__/permissions-administrations'
import { titreCreate } from '../src/database/queries/titres'
import { IAdministration, ITitre } from '../src/types'
import { administrationsGet } from '../src/database/queries/administrations'

console.info = jest.fn()
console.error = jest.fn()

let administrations = [] as IAdministration[]

beforeAll(async () => {
  await dbManager.populateDb()
  administrations = (await administrationsGet(
    {},
    {
      fields: {
        titresTypesTitresStatuts: { id: {} },
        titresTypesEtapesTypes: { id: {} },
        titresTypes: { id: {} }
      }
    },
    'super'
  )) as IAdministration[]
})

afterEach(async () => {
  await dbManager.truncateDb()
})

afterAll(async () => {
  dbManager.closeKnex()
})

describe('permissions des administrations', () => {
  const titreQuery = queryImport('titre')

  // Impossible de récupérer 'administrations', le describe ne permet pas l'asynchrone
  const scenarios = scenariosGet(administrations)

  test.each(scenarios)(
    '%s',
    async (message, administration, titre, response) => {
      await titreCreate(titre, {}, 'super')
      const res = await graphQLCall(
        titreQuery,
        { id: titre.id },
        'admin',
        administration
      )

      expect(res.body.errors).toBeUndefined()
      expect(res.body.data).toMatchObject(response)
    }
  )
})
