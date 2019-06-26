import titresDemarcheStatutIdUpdate from './titres-demarches-statut-ids-update'
import * as titreDemarches from '../queries/titre-demarches'

import { titresDemarchesOctPoints } from './__mocks__/titres-demarches-statut-ids-update-demarches'

// `jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../queries/titre-demarches', () => ({
  titreDemarcheStatutIdUpdate: () => {}
}))

console.log = jest.fn()

describe("met à jour le statut d'une démarche en fonction du type de titre", () => {
  test('le statut de la démarche est mis à jour', async () => {
    titreDemarches.titreDemarcheStatutIdUpdate = () => Promise.resolve(true)

    expect(
      await titresDemarcheStatutIdUpdate(titresDemarchesOctPoints)
    ).toEqual('Mise à jour: 1 statuts de démarches.')
    expect(console.log).toHaveBeenCalled()
  })

  test("le statut de la démarche n'est pas mis à jour", async () => {
    titreDemarches.titreDemarcheStatutIdUpdate = () => false

    expect(
      await titresDemarcheStatutIdUpdate(titresDemarchesOctPoints)
    ).toEqual('Mise à jour: 0 statuts de démarches.')
    expect(console.log).not.toHaveBeenCalled()
  })
})
