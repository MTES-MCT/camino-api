import titresDemarchesOrdreUpdate from './titres-demarches-ordre-update'

import {
  titresDemarchesDesordonnees,
  titresDemarchesOrdonnees
} from './__mocks__/titres-demarches-ordre-update-demarches'

// `jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../queries/titre-demarches', () => ({
  titreDemarcheUpdate: jest.fn().mockResolvedValue()
}))

console.log = jest.fn()

describe('ordre des démarches', () => {
  test("met à jour l'ordre de deux démarches", async () => {
    const log = await titresDemarchesOrdreUpdate(titresDemarchesDesordonnees)
    expect(log).toEqual('Mise à jour: 2 démarche(s) (ordre).')
    expect(console.log).toHaveBeenCalledTimes(2)
  })

  test('ne met à jour aucune démarche', async () => {
    const log = await titresDemarchesOrdreUpdate(titresDemarchesOrdonnees)
    expect(log).toEqual('Mise à jour: 0 démarche(s) (ordre).')
    expect(console.log).not.toHaveBeenCalled()
  })
})
