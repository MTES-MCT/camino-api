import titresDemarcheStatutIdUpdate from './titres-demarches-statut-ids-update'

import {
  titresDemarchesStatutModifie,
  titresDemarchesStatutIdentique
} from './__mocks__/titres-demarches-statut-ids-update-demarches'

jest.mock('../../database/queries/titres-demarches', () => ({
  titreDemarcheUpdate: jest.fn().mockResolvedValue(true)
}))

console.info = jest.fn()

describe("statut des démarches d'un titre", () => {
  test("met à jour le statut d'une démarche", async () => {
    const titresDemarchesStatutUpdated = await titresDemarcheStatutIdUpdate(
      titresDemarchesStatutModifie
    )

    expect(titresDemarchesStatutUpdated.length).toEqual(1)
    expect(console.info).toHaveBeenCalled()
  })

  test("ne met pas à jour le statut d'une démarche", async () => {
    const titresDemarchesStatutUpdated = await titresDemarcheStatutIdUpdate(
      titresDemarchesStatutIdentique
    )

    expect(titresDemarchesStatutUpdated.length).toEqual(0)
    expect(console.info).not.toHaveBeenCalled()
  })
})
