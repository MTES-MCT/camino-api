import 'dotenv/config'

import { dbManager } from './init'
import { graphQLCall, queryImport } from './_utils'
import {
  // titresStatuts,
  // // administrations,
  // titreTypeAdministrationGestionnaireGet,
  // titreTypeAdministrationAssocieeGet,
  // administrationsTitresTypesEtapesTypes,
  // administrationsTitresTypesTitresStatuts,
  // restrictionsVisibiliteSet,
  // restrictionsModificationSet,
  // titreTemplate
  scenariosGet
} from './__mocks__/permissions-administrations'
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

describe('Permissions des administrations', () => {
  const titreQuery = queryImport('titre')

  const scenarios = scenariosGet()

  test.each(scenarios)(
    '%s',
    async (message, administration, titre, graphQLResponse) => {
      await titreCreate(titre, {}, 'super')
      const res = await graphQLCall(
        titreQuery,
        { id: 'titre-id' },
        'admin',
        administration
      )

      expect(res.body.errors).toBeUndefined()
      expect(res.body.data).toMatchObject(graphQLResponse)
    }
  )
})
