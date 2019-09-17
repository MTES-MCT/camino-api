import titresStatutIdsUpdate from './titres-statut-ids-update'

import {
  titresValideStatutIdAJour,
  titresEchuStatutIdObselete
} from './__mocks__/titres-statut-ids-update-titres'

jest.mock('../../database/queries/titres', () => ({
  titreUpdate: jest.fn().mockResolvedValue()
}))

console.log = jest.fn()

describe("statut d'un titre", () => {
  test('met à jour un titre si son statut est obsolète', async () => {
    const titresUpdatedRequests = await titresStatutIdsUpdate(
      titresEchuStatutIdObselete
    )
    expect(titresUpdatedRequests.length).toEqual(1)
    expect(console.log).toHaveBeenCalled()
  })

  test("ne met pas à jour le statut d'un titre", async () => {
    const titresUpdatedRequests = await titresStatutIdsUpdate(
      titresValideStatutIdAJour
    )
    expect(titresUpdatedRequests.length).toEqual(0)
    expect(console.log).not.toHaveBeenCalled()
  })
})
