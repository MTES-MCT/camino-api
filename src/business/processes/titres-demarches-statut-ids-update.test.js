import titresDemarcheStatutIdUpdate from './titres-demarches-statut-ids-update'

import {
  titresDemarchesStatutModifie,
  titresDemarchesStatutIdentique
} from './__mocks__/titres-demarches-statut-ids-update-demarches'

// `jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../../database/queries/titres-demarches', () => ({
  titreDemarcheUpdate: jest.fn().mockResolvedValue()
}))

console.log = jest.fn()

describe("statut des démarches d'un titre", () => {
  test("met à jour le statut d'une démarche", async () => {
    const log = await titresDemarcheStatutIdUpdate(titresDemarchesStatutModifie)

    expect(log).toEqual('mise à jour: 1 démarche(s) (statut)')
    expect(console.log).toHaveBeenCalled()
  })

  test("ne met pas à jour le statut d'une démarche", async () => {
    const log = await titresDemarcheStatutIdUpdate(
      titresDemarchesStatutIdentique
    )

    expect(log).toEqual('mise à jour: 0 démarche(s) (statut)')
    expect(console.log).not.toHaveBeenCalled()
  })
})
