import entrepriseUpdate from './entreprises-update'
import * as apiEntreprises from '../../tools/api-insee'

import {
  dbEntreprisesCreees,
  dbEntreprisesEtablissementsCreees,
  apiEntreprisesCreees,
  dbEntreprisesModifiees,
  dbEntreprisesEtablissementsModifies,
  apiEntreprisesModifiees,
  dbEntreprisesSupprimeees,
  dbEntreprisesEtablissementsSupprimeees,
  apiEntreprisesSupprimeees,
  dbEntreprisesExistantes,
  dbEntreprisesEtablissementsExistants,
  apiEntreprisesExistantes,
  entreprisesEtablissementsApiExistantes,
  dbEntreprisesInexistantes,
  dbEntreprisesEtablissementsInexistants,
  apiEntreprisesInexistantes
} from './__mocks__/entreprises-update'

// 'jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../../database/queries/entreprises', () => ({
  entreprisesUpsert: jest.fn().mockImplementation(a => a)
}))

jest.mock('../../database/queries/entreprises-etablissements', () => ({
  entreprisesEtablissementsUpsert: jest.fn().mockImplementation(a => a),
  entreprisesEtablissementsDelete: jest.fn()
}))

// 'jest.mock()' est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../../tools/api-insee', () => ({
  entreprisesGet: jest.fn(),
  entreprisesEtablissementsGet: jest.fn()
}))

console.log = jest.fn()
console.info = jest.fn()

describe('entreprises', () => {
  test("crée les entreprises si elles n'existent pas", async () => {
    apiEntreprises.entreprisesGet.mockResolvedValue(apiEntreprisesCreees)
    apiEntreprises.entreprisesEtablissementsGet.mockResolvedValue(
      apiEntreprisesCreees
    )

    const [
      entreprisesUpdated,
      etablissementsUpdated,
      etablissementsDeleted
    ] = await entrepriseUpdate(
      dbEntreprisesCreees,
      dbEntreprisesEtablissementsCreees
    )

    expect(etablissementsUpdated.length).toEqual(1)
    expect(etablissementsDeleted.length).toEqual(0)
    expect(entreprisesUpdated.length).toEqual(1)
    expect(console.log).toHaveBeenCalled()
    expect(console.info).toHaveBeenCalled()
  })

  test('met à jour les entreprises qui ont été modifiées', async () => {
    apiEntreprises.entreprisesGet.mockResolvedValue(apiEntreprisesModifiees)
    apiEntreprises.entreprisesEtablissementsGet.mockResolvedValue(
      apiEntreprisesModifiees
    )

    const [
      entreprisesUpdated,
      etablissementsUpdated,
      etablissementsDeleted
    ] = await entrepriseUpdate(
      dbEntreprisesModifiees,
      dbEntreprisesEtablissementsModifies
    )

    expect(etablissementsUpdated.length).toEqual(1)
    expect(etablissementsDeleted.length).toEqual(0)
    expect(entreprisesUpdated.length).toEqual(1)
    expect(console.log).toHaveBeenCalled()
  })

  test('supprime les entreprises qui ont été supprimés', async () => {
    apiEntreprises.entreprisesGet.mockResolvedValue(apiEntreprisesSupprimeees)
    apiEntreprises.entreprisesEtablissementsGet.mockResolvedValue(
      apiEntreprisesSupprimeees
    )

    const [
      entreprisesUpdated,
      etablissementsUpdated,
      etablissementsDeleted
    ] = await entrepriseUpdate(
      dbEntreprisesSupprimeees,
      dbEntreprisesEtablissementsSupprimeees
    )

    expect(etablissementsUpdated.length).toEqual(0)
    expect(etablissementsDeleted.length).toEqual(1)
    expect(entreprisesUpdated.length).toEqual(0)
    expect(console.log).toHaveBeenCalled()
  })

  test('ne crée pas les entreprises qui existent déjà', async () => {
    apiEntreprises.entreprisesGet.mockResolvedValue(apiEntreprisesExistantes)
    apiEntreprises.entreprisesEtablissementsGet.mockResolvedValue(
      entreprisesEtablissementsApiExistantes
    )

    const [
      entreprisesUpdated,
      etablissementsUpdated,
      etablissementsDeleted
    ] = await entrepriseUpdate(
      dbEntreprisesExistantes,
      dbEntreprisesEtablissementsExistants
    )

    expect(entreprisesUpdated.length).toEqual(0)
    expect(etablissementsDeleted.length).toEqual(0)
    expect(etablissementsUpdated.length).toEqual(0)
    expect(console.log).not.toHaveBeenCalled()
  })

  test("ne modifie pas d'entreprises si elles n'existent pas", async () => {
    apiEntreprises.entreprisesGet.mockResolvedValue(apiEntreprisesInexistantes)
    apiEntreprises.entreprisesEtablissementsGet.mockResolvedValue(
      apiEntreprisesInexistantes
    )

    const [
      entreprisesUpdated,
      etablissementsUpdated,
      etablissementsDeleted
    ] = await entrepriseUpdate(
      dbEntreprisesInexistantes,
      dbEntreprisesEtablissementsInexistants
    )

    expect(etablissementsUpdated.length).toEqual(0)
    expect(etablissementsDeleted.length).toEqual(0)
    expect(entreprisesUpdated.length).toEqual(0)
    expect(console.log).not.toHaveBeenCalled()
  })
})
