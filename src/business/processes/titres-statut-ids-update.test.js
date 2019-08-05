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
    expect(await titresStatutIdsUpdate(titresEchuStatutIdObselete)).toEqual(
      'mise à jour: 1 titre(s) (statuts)'
    )
    expect(console.log).toHaveBeenCalled()
  })

  test("ne met pas à jour le statut d'un titre", async () => {
    expect(await titresStatutIdsUpdate(titresValideStatutIdAJour)).toEqual(
      'mise à jour: 0 titre(s) (statuts)'
    )
    expect(console.log).not.toHaveBeenCalled()
  })
})
