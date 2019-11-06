import entrepriseUpdate from './entreprises-update'
import * as apiEntreprises from '../../tools/api-insee'

import {
  entreprisesDbCreees,
  entreprisesEtablissementsDbCreees,
  entreprisesApiCreees,
  entreprisesDbModifiees,
  entreprisesEtablissementsDbModifies,
  entreprisesApiModifiees,
  entreprisesDbExistantes,
  entreprisesEtablissementsDbExistants,
  entreprisesApiExistantes,
  entreprisesEtablissementsApiExistantes,
  entreprisesDbInexistantes,
  entreprisesEtablissementsDbInexistants,
  entreprisesApiInexistantes
} from './__mocks__/entreprises-update'

// 'jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../../database/queries/entreprises', () => ({
  entreprisesUpsert: jest.fn().mockImplementation(a => a)
}))

jest.mock('../../database/queries/entreprises-etablissements', () => ({
  entreprisesEtablissementsUpsert: jest.fn().mockImplementation(a => a)
}))

// 'jest.mock()' est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../../tools/api-insee', () => ({
  entreprisesGet: jest.fn(),
  entreprisesEtablissementsGet: jest.fn()
}))

console.log = jest.fn()
console.info = jest.fn()
console.error = jest.fn()

describe('entreprises', () => {
  test("crée les entreprises si elles n'existent pas", async () => {
    apiEntreprises.entreprisesGet.mockResolvedValue(entreprisesApiCreees)
    apiEntreprises.entreprisesEtablissementsGet.mockResolvedValue(
      entreprisesApiCreees
    )

    const [etablissementsUpdated, entreprisesUpdated] = await entrepriseUpdate(
      entreprisesDbCreees,
      entreprisesEtablissementsDbCreees
    )

    expect(etablissementsUpdated.length).toEqual(1)
    expect(entreprisesUpdated.length).toEqual(1)
    expect(console.log).toHaveBeenCalled()
    expect(console.info).toHaveBeenCalled()
  })

  test('met à jour les entreprises qui ont été modifiées', async () => {
    apiEntreprises.entreprisesGet.mockResolvedValue(entreprisesApiModifiees)
    apiEntreprises.entreprisesEtablissementsGet.mockResolvedValue(
      entreprisesApiModifiees
    )

    const [etablissementsUpdated, entreprisesUpdated] = await entrepriseUpdate(
      entreprisesDbModifiees,
      entreprisesEtablissementsDbModifies
    )

    expect(etablissementsUpdated.length).toEqual(1)
    expect(entreprisesUpdated.length).toEqual(1)
    expect(console.log).toHaveBeenCalled()
  })

  test('ne crée pas les entreprises qui existent déjà', async () => {
    apiEntreprises.entreprisesGet.mockResolvedValue(entreprisesApiExistantes)
    apiEntreprises.entreprisesEtablissementsGet.mockResolvedValue(
      entreprisesEtablissementsApiExistantes
    )

    const [entreprisesUpdated, etablissementsUpdated] = await entrepriseUpdate(
      entreprisesDbExistantes,
      entreprisesEtablissementsDbExistants
    )

    expect(entreprisesUpdated.length).toEqual(0)
    expect(etablissementsUpdated.length).toEqual(0)
    expect(console.log).not.toHaveBeenCalled()
  })

  test("ne modifie pas d'entreprises si elles n'existent déjà", async () => {
    apiEntreprises.entreprisesGet.mockResolvedValue(entreprisesApiInexistantes)
    apiEntreprises.entreprisesEtablissementsGet.mockResolvedValue(
      entreprisesApiInexistantes
    )

    const [etablissementsUpdated, entreprisesUpdated] = await entrepriseUpdate(
      entreprisesDbInexistantes,
      entreprisesEtablissementsDbInexistants
    )

    expect(etablissementsUpdated.length).toEqual(0)
    expect(entreprisesUpdated.length).toEqual(0)
    expect(console.log).not.toHaveBeenCalled()
  })
})
