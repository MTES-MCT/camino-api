import { titrePropsUpdate, titreIdsUpdate } from './titres'
import * as titresQueries from '../../database/queries/titres'

// `jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../../database/queries/titres', () => ({
  titreUpdate: jest.fn().mockImplementation(() => Promise.resolve()),
  titreIdUpdate: jest.fn().mockImplementation(() => Promise.resolve())
}))

beforeAll(() => {
  jest
    .spyOn(titresQueries, 'titreUpdate')
    .mockImplementation((titre, prop) => Promise.resolve())
})

afterAll(() => {
  jest.restoreAllMocks()
})

describe("propriétés calculées d'un titre", () => {
  test("met à jour les propriétés d'un titre", async () => {
    const log = await titrePropsUpdate('m-prx-saint-pierre-2014', {
      pointsEtapeId: 'm-prx-saint-pierre-2014-oct01-dpu02'
    })

    expect(log).toEqual(
      'Mise à jour: titre m-prx-saint-pierre-2014 props: {"pointsEtapeId":"m-prx-saint-pierre-2014-oct01-dpu02"}'
    )
    expect(titresQueries.titreUpdate).toHaveBeenCalled()
  })
})

describe("ids d'un titre et ses dépendances", () => {
  test('met à jour le titre et ses dépendances', async () => {
    const log = await titreIdsUpdate('m-prx-saint-pierre-2013', {
      id: 'm-prx-saint-pierre-2014'
    })

    expect(log).toEqual('Mise à jour: titre ids: m-prx-saint-pierre-2014')
    expect(titresQueries.titreIdUpdate).toHaveBeenCalled()
  })
})
