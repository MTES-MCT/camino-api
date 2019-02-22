import titresStatutIdsUpdate from './titres-statut-ids-update'
import * as titres from '../queries/titres'

import {
  titresValideStatutIdAJour,
  titresEchuStatutIdObselete
} from './__mocks__/titres-statut-ids-update-titres'

// `jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../queries/titres', () => ({
  titreStatutIdUpdate: (titre, statutId) =>
    statutId !== titre.statutId && Promise.resolve()
}))

console.log = jest.fn()

describe("met à jour le statut d'un titre", () => {
  test('un statut obselète est mis à jour', async () => {
    expect(await titresStatutIdsUpdate(titresEchuStatutIdObselete)).toEqual(
      'Mise à jour: 1 statuts de titres.'
    )
    expect(console.log).toHaveBeenCalled()
  })

  test("un statut à jour n'est pas mis à jour", async () => {
    expect(await titresStatutIdsUpdate(titresValideStatutIdAJour)).toEqual(
      'Mise à jour: 0 statuts de titres.'
    )
    expect(console.log).not.toHaveBeenCalled()
  })
})
