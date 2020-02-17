import titresDemarchesOrdreUpdate from './titres-demarches-ordre-update'

import {
  titresDemarchesDesordonnees,
  titresDemarchesOrdonnees
} from './__mocks__/titres-demarches-ordre-update-demarches'

jest.mock('../../database/queries/titres-demarches', () => ({
  titreDemarcheUpdate: jest.fn().mockResolvedValue(true)
}))

console.log = jest.fn()

describe('ordre des démarches', () => {
  test("met à jour l'ordre de deux démarches", async () => {
    const titresDemarchesOrdreUpdated = await titresDemarchesOrdreUpdate(
      titresDemarchesDesordonnees
    )
    expect(titresDemarchesOrdreUpdated.length).toEqual(2)
    expect(console.log).toHaveBeenCalledTimes(2)
  })

  test('ne met à jour aucune démarche', async () => {
    const titresDemarchesOrdreUpdated = await titresDemarchesOrdreUpdate(
      titresDemarchesOrdonnees
    )
    expect(titresDemarchesOrdreUpdated.length).toEqual(0)
    expect(console.log).not.toHaveBeenCalled()
  })
})
