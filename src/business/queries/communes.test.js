import { communesUpsert } from './communes'
import * as communesQueries from '../../database/queries/territoires'

import { communesNouvelles } from './__mocks__/communes-communes'

// `jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../../database/queries/territoires', () => ({
  communesUpsert: jest.fn().mockResolvedValue()
}))

describe('communes', () => {
  test("insert deux communes qui n'existent pas en base", async () => {
    const log = await communesUpsert(communesNouvelles)

    expect(log).toEqual('Mise à jour: communes, Metz, Paris')
    expect(communesQueries.communesUpsert).toHaveBeenCalled()
  })
})
