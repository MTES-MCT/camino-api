import titresDemarchesOrdreUpdate from './titres-demarches-ordre-update'
import * as titreDemarches from '../queries/titre-demarches'

import { titresDemarcheOctPoints } from './__mocks__/titres-demarches-ordre-update-demarches'

// `jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../queries/titre-demarches', () => ({
  titreDemarchesOrdreUpdate: () => {}
}))

console.log = jest.fn()

describe("met à jour l'ordre de toutes les démarches d'un titre", () => {
  test("met à jour l'ordre de deux démarches", async () => {
    titreDemarches.titreDemarchesOrdreUpdate = () =>
      [1, 2].map(p => Promise.resolve(p))

    expect(await titresDemarchesOrdreUpdate(titresDemarcheOctPoints)).toEqual(
      'Mise à jour: 2 ordres de démarches.'
    )
    expect(console.log).toHaveBeenCalledTimes(2)
  })

  test("aucune mise à jour n'est effectuée", async () => {
    titreDemarches.titreDemarchesOrdreUpdate = () => false

    expect(await titresDemarchesOrdreUpdate(titresDemarcheOctPoints)).toEqual(
      'Mise à jour: 0 ordres de démarches.'
    )
    expect(console.log).not.toHaveBeenCalled()
  })
})
