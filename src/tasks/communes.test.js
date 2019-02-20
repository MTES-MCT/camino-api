import { communesInsert } from './communes'
import * as communesQueries from '../database/queries/communes'

import {
  communesNouvelles,
  communesAnciennes
} from './__mocks__/communes-communes'

// `jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../database/queries/communes', () => ({
  communeInsert: jest.fn().mockImplementation(() => Promise.resolve())
}))

console.log = jest.fn()

describe('ajoute ou met à jour une commune', () => {
  test("insert deux communes qui n'existaient pas dans la liste en base", async () => {
    expect(
      await Promise.all(communesInsert(communesNouvelles, communesAnciennes))
    ).toEqual([
      'Mise à jour: commune, {"id":"Metz"}',
      'Mise à jour: commune, {"id":"Paris"}'
    ])
    expect(communesQueries.communeInsert).toHaveBeenCalledTimes(2)
  })

  test('les communes qui existent déjà dans la liste ne sont pas insérées en base', async () => {
    expect(await communesInsert(communesNouvelles, communesNouvelles)).toEqual(
      []
    )
    expect(communesQueries.communeInsert).not.toHaveBeenCalled()
  })
})
