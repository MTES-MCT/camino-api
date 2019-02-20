const communesQueries = {
  communeInsert: jest.fn().mockImplementation(() => Promise.resolve())
}

jest.mock('../database/queries/communes', () => communesQueries)

import { communesInsert } from './communes'

import {
  communesNouvelles,
  communesAnciennes
} from './__mocks__/communes-communes'

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
