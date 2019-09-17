import administrationUpdate from './administrations-update'
import * as apiAdministrations from '../../tools/api-administrations/index'

import {
  departements,
  administrationsDbCreees,
  administrationsApiCreees,
  administrationsDbModifiees,
  administrationsApiModifiees,
  administrationsDbExistantes,
  administrationsApiExistantes
} from './__mocks__/administrations-update'

jest.mock('../../database/queries/administrations', () => ({
  administrationsUpsert: jest.fn().mockResolvedValue()
}))

jest.mock('../../tools/api-administrations/index', () => ({
  organismesDepartementsGet: jest.fn()
}))

console.log = jest.fn()

describe('administrations', () => {
  test("crée les administrations si elles n'existent pas", async () => {
    apiAdministrations.organismesDepartementsGet.mockResolvedValue(
      administrationsApiCreees
    )

    const administrationsUpdated = await administrationUpdate(
      administrationsDbCreees,
      departements
    )

    expect(administrationsUpdated.length).toEqual(1)
    expect(console.log).toHaveBeenCalled()
  })

  test('met à jour les administrations qui ont été modifiées', async () => {
    apiAdministrations.organismesDepartementsGet.mockResolvedValue(
      administrationsApiModifiees
    )

    const administrationsUpdated = await administrationUpdate(
      administrationsDbModifiees,
      departements
    )

    expect(administrationsUpdated.length).toEqual(1)
    expect(console.log).toHaveBeenCalled()
  })

  test('ne crée pas les administrations qui existent déjà', async () => {
    apiAdministrations.organismesDepartementsGet.mockResolvedValue(
      administrationsApiExistantes
    )

    const administrationsUpdated = await administrationUpdate(
      administrationsDbExistantes,
      departements
    )

    expect(administrationsUpdated.length).toEqual(0)
    expect(console.log).not.toHaveBeenCalled()
  })
})
