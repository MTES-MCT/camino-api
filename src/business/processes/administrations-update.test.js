import administrationUpdate from './administrations-update'
import * as apiAdministrations from '../../tools/api-administrations'

import {
  departements,
  administrationsDbCreees,
  administrationsApiCreees,
  administrationsDbModifiees,
  administrationsApiModifiees,
  administrationsDbExistantes,
  administrationsApiExistantes
} from './__mocks__/administrations-update'

// `jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../../database/queries/administrations', () => ({
  administrationsUpsert: jest.fn().mockResolvedValue()
}))

// `jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../../tools/api-administrations', () => ({
  organismesDepartementsGet: jest.fn()
}))

console.log = jest.fn()

describe('administrations', () => {
  test("crée les administrations si elles n'existent pas", async () => {
    apiAdministrations.organismesDepartementsGet.mockResolvedValue(
      administrationsApiCreees
    )

    const log = await administrationUpdate(
      administrationsDbCreees,
      departements
    )

    expect(log).toEqual('Mise à jour: 1 administration(s).')
    expect(console.log).toHaveBeenCalled()
  })

  test('met à jour les administrations qui ont été modifiées', async () => {
    apiAdministrations.organismesDepartementsGet.mockResolvedValue(
      administrationsApiModifiees
    )

    const log = await administrationUpdate(
      administrationsDbModifiees,
      departements
    )

    expect(log).toEqual('Mise à jour: 1 administration(s).')
    expect(console.log).toHaveBeenCalled()
  })

  test('ne crée pas les administrations qui existent déjà', async () => {
    apiAdministrations.organismesDepartementsGet.mockResolvedValue(
      administrationsApiExistantes
    )

    const log = await administrationUpdate(
      administrationsDbExistantes,
      departements
    )

    expect(log).toEqual('Mise à jour: 0 administration(s).')
    expect(console.log).not.toHaveBeenCalled()
  })
})
