import titresDemarchePublicUpdate from './titres-demarches-public-update'

import {
  titresDemarchesPublicModifie,
  titresDemarchesPublicIdentique
} from './__mocks__/titres-demarches-public-update-demarches'

jest.mock('../../database/queries/titres-demarches', () => ({
  titreDemarcheUpdate: jest.fn().mockResolvedValue(true)
}))

console.info = jest.fn()

describe("public des démarches d'un titre", () => {
  test("met à jour la publicité d'une démarche", async () => {
    const titresDemarchesPublicUpdated = await titresDemarchePublicUpdate(
      titresDemarchesPublicModifie
    )

    expect(titresDemarchesPublicUpdated.length).toEqual(1)
    expect(console.info).toHaveBeenCalled()
  })

  test("ne met pas à jour la publicité d'une démarche", async () => {
    const titresDemarchesPublicUpdated = await titresDemarchePublicUpdate(
      titresDemarchesPublicIdentique
    )

    expect(titresDemarchesPublicUpdated.length).toEqual(0)
    expect(console.info).not.toHaveBeenCalled()
  })
})
