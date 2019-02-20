import titreStatutIdUpdate from './titre-statut-id-update'
import * as titres from '../titres'

import {
  titreValideStatutIdAJour,
  titreEchuStatutIdObselete
} from './__mocks__/titre-statut-id-update-titres'

// `jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../titres', () => ({
  titreStatutIdUpdate: (titre, statutId) =>
    statutId !== titre.statutId && Promise.resolve()
}))

describe("met à jour le statut d'un titre", () => {
  test('un statut obselète est mis à jour', async () => {
    expect(await titreStatutIdUpdate(titreEchuStatutIdObselete)).toEqual(
      'Mise à jour: 1 statuts de titres.'
    )
  })

  test("un statut à jour n'est pas mis à jour", async () => {
    expect(await titreStatutIdUpdate(titreValideStatutIdAJour)).toEqual(
      'Mise à jour: 0 statuts de titres.'
    )
  })
})
