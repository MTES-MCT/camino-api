import 'dotenv/config'

import { dbManager } from './init'
import { graphQLCall, queryImport } from './_utils/index'
import { scenariosGet } from './_utils/administrations-permissions'
import administrations from './_utils/administrations'
import { titreCreate } from '../src/database/queries/titres'

console.info = jest.fn()
console.error = jest.fn()

beforeAll(async () => {
  await dbManager.populateDb()
})

afterEach(async () => {
  await dbManager.truncateDb()
})

afterAll(async () => {
  dbManager.closeKnex()
})

describe('permissions des administrations', () => {
  const scenarios = scenariosGet(administrations)
  const titreQuery = queryImport('titre')

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
