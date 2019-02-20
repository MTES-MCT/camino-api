import titresDemarchesOrdreUpdate from './titre-demarches-ordre-update'
import * as titreDemarches from '../titre-demarches'

import { titresDemarcheOctPoints } from './__mocks__/titre-demarches-ordre-update-demarches'

// `jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../titre-demarches', () => ({
  titreDemarchesOrdreUpdate: () => {}
}))

console.log = jest.fn()

describe("met à jour l'ordre de toutes les démarches d'un titre", () => {
  test("met à jour l' ordre de deux démarches", async () => {
    titreDemarches.titreDemarchesOrdreUpdate = () =>
      [1, 2].map(p => Promise.resolve(p))

    expect(await titresDemarchesOrdreUpdate(titresDemarcheOctPoints)).toEqual(
      'Mise à jour: 2 ordres de démarches.'
    )
  })
})
