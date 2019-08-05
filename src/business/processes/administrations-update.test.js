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

    const log = await administrationUpdate(
      administrationsDbCreees,
      departements
    )

    expect(log).toEqual('mise à jour: 1 administration(s)')
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

    expect(log).toEqual('mise à jour: 1 administration(s)')
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

    expect(log).toEqual('mise à jour: 0 administration(s)')
    expect(console.log).not.toHaveBeenCalled()
  })
})
