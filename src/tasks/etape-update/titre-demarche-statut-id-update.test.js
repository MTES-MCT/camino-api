import titresDemarcheStatutIdUpdate from './titre-demarche-statut-id-update'
import * as titreDemarches from '../titre-demarches'

import { titreDemarcheOctPoints } from './__mocks__/titre-demarche-statut-id-update-demarches'

// `jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../titre-demarches', () => ({
  titreDemarcheStatutIdUpdate: () => {}
}))

console.log = jest.fn()

describe("met à jour le statut d'une démarche en fonction du type de titre", () => {
  test('le statut de la démarche est mis à jour', async () => {
    titreDemarches.titreDemarcheStatutIdUpdate = () => Promise.resolve(true)

    expect(await titresDemarcheStatutIdUpdate(titreDemarcheOctPoints)).toEqual(
      'Mise à jour: 1 statut de démarche.'
    )
  })

  test("le statut de la démarche n'est pas mis à jour", async () => {
    titreDemarches.titreDemarcheStatutIdUpdate = () => false

    expect(await titresDemarcheStatutIdUpdate(titreDemarcheOctPoints)).toEqual(
      'Mise à jour: 0 statut de démarche.'
    )
  })
})
