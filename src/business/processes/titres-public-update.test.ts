import titresPublicUpdate from './titres-public-update'

import {
  titresPublicModifie,
  titresPublicIdentique
} from './__mocks__/titres-public-update-titres'

jest.mock('../../database/queries/titres', () => ({
  titreUpdate: jest.fn().mockResolvedValue(true)
}))

console.info = jest.fn()

describe("public des titres d'un titre", () => {
  test("met à jour la publicité d'un titre", async () => {
    const titresPublicUpdated = await titresPublicUpdate(
      titresPublicModifie
    )

    expect(titresPublicUpdated.length).toEqual(1)
    expect(console.info).toHaveBeenCalled()
  })

  test("ne met pas à jour la publicité d'un titre", async () => {
    const titresPublicUpdated = await titresPublicUpdate(
      titresPublicIdentique
    )

    expect(titresPublicUpdated.length).toEqual(0)
    expect(console.info).not.toHaveBeenCalled()
  })
})
