import { mocked } from 'ts-jest/utils'
import entrepriseUpdate from './entreprises-update'
import {
  entreprisesGet,
  entreprisesEtablissementsGet
} from '../../tools/api-insee'

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
  dbEntreprisesInexistantes,
  dbEntreprisesEtablissementsInexistants,
  apiEntreprisesInexistantes,
  apiEntreprisesEtablissmentsInexistantes,
  apiEntreprisesEtablissementsExistantes,
  apiEntreprisesEtablissementsCreees,
  apiEntreprisesEtablissementsModifiees,
  apiEntreprisesEtablissementsSupprimeees
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
  __esModule: true,
  entreprisesGet: jest.fn(),
  entreprisesEtablissementsGet: jest.fn()
}))

const entreprisesGetMock = mocked(entreprisesGet, true)
const entreprisesEtablissementsGetMock = mocked(
  entreprisesEtablissementsGet,
  true
)

console.log = jest.fn()
console.info = jest.fn()

describe('entreprises', () => {
  test("crée les entreprises si elles n'existent pas", async () => {
    entreprisesGetMock.mockResolvedValue(apiEntreprisesCreees)
    entreprisesEtablissementsGetMock.mockResolvedValue(
      apiEntreprisesEtablissementsCreees
    )

    const [
      entreprisesUpdated,
      etablissementsUpdated,
      etablissementsDeleted
    ] = await entrepriseUpdate(
      dbEntreprisesCreees,
      dbEntreprisesEtablissementsCreees
    )

    expect(etablissementsUpdated).toEqual([
      { id: 'pipo', nom: 'pipo' },
      { id: 'toto', nom: 'toto' }
    ])
    expect(etablissementsDeleted.length).toEqual(0)
    expect(entreprisesUpdated).toEqual([{ id: 'papa', legalSiren: 'toto' }])
    expect(console.log).toHaveBeenCalled()
    expect(console.info).toHaveBeenCalled()
  })

  test('met à jour les entreprises qui ont été modifiées', async () => {
    entreprisesGetMock.mockResolvedValue(apiEntreprisesModifiees)
    entreprisesEtablissementsGetMock.mockResolvedValue(
      apiEntreprisesEtablissementsModifiees
    )

    const [
      entreprisesUpdated,
      etablissementsUpdated,
      etablissementsDeleted
    ] = await entrepriseUpdate(
      dbEntreprisesModifiees,
      dbEntreprisesEtablissementsModifies
    )

    expect(etablissementsUpdated).toEqual([{ id: 'toto', nom: 'tutu' }])
    expect(etablissementsDeleted.length).toEqual(0)
    expect(entreprisesUpdated).toEqual([{ id: 'toto', legalSiren: 'papa' }])
    expect(console.log).toHaveBeenCalled()
  })

  test('supprime les entreprises qui ont été supprimés', async () => {
    entreprisesGetMock.mockResolvedValue(apiEntreprisesSupprimeees)
    entreprisesEtablissementsGetMock.mockResolvedValue(
      apiEntreprisesEtablissementsSupprimeees
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
    entreprisesGetMock.mockResolvedValue(apiEntreprisesExistantes)
    entreprisesEtablissementsGetMock.mockResolvedValue(
      apiEntreprisesEtablissementsExistantes
    )

    const [
      entreprisesUpdated,
      etablissementsUpdated,
      etablissementsDeleted
    ] = await entrepriseUpdate(
      dbEntreprisesExistantes,
      dbEntreprisesEtablissementsExistants
    )

    expect(entreprisesUpdated).toEqual([])
    expect(etablissementsDeleted.length).toEqual(0)
    expect(etablissementsUpdated).toEqual([])
    expect(console.log).not.toHaveBeenCalled()
  })

  test("ne modifie pas d'entreprises si elles n'existent pas", async () => {
    entreprisesGetMock.mockResolvedValue(apiEntreprisesInexistantes)
    entreprisesEtablissementsGetMock.mockResolvedValue(
      apiEntreprisesEtablissmentsInexistantes
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
