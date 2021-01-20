import 'dotenv/config'

import { dbManager } from './init'
import { graphQLCall, queryImport } from './_utils/index'
import { scenariosBuild } from './_utils/administrations-permissions'
import administrations from './_utils/administrations'
import { titreCreate } from '../src/database/queries/titres'

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

describe('permissions des administrations', () => {
  const scenarios = scenariosBuild(
    administrations.filter(a => a.id === 'dea-guyane-01')
  )
  const titreQuery = queryImport('titre')

  test.each(scenarios)('%s', async (message, administration, titre, result) => {
    await titreCreate(titre, {}, 'super')

    const res = await graphQLCall(
      titreQuery,
      { id: titre.id },
      'admin',
      administration
    )

    expect(res.body.data.titre).toMatchObject(result)
    expect(res.body.errors).toBeUndefined()
  })
})
