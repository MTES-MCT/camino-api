import { mocked } from 'ts-jest/utils'
import administrationUpdate from './administrations-update'
import {
  organismeDepartementGet,
  organismesDepartementsGet
} from '../../tools/api-administrations/index'

import {
  departement,
  departements,
  administrationsDbCreees,
  administrationsApiCreees,
  administrationsDbModifiees,
  administrationsApiModifiees,
  administrationsDbExistantes,
  administrationsApiExistantes
} from './__mocks__/administrations-update'

jest.mock('../../database/queries/administrations', () => ({
  __esModule: true,
  administrationsUpsert: jest.fn()
}))

jest.mock('../../tools/api-administrations/index', () => ({
  __esModule: true,
  organismeDepartementGet: jest.fn(),
  organismesDepartementsGet: jest.fn()
}))

const organismeDepartementGetMock = mocked(organismeDepartementGet, true)
const organismesDepartementsGetMock = mocked(organismesDepartementsGet, true)

console.log = jest.fn()

describe('administrations', () => {
  test("crée les administrations si elles n'existent pas", async () => {
    organismeDepartementGetMock.mockResolvedValue(departement)
    organismesDepartementsGetMock.mockResolvedValue(administrationsApiCreees)

    const administrationsUpdated = await administrationUpdate(
      administrationsDbCreees,
      departements
    )

    expect(administrationsUpdated.length).toEqual(1)
    expect(console.log).toHaveBeenCalled()
  })

  test('met à jour les administrations qui ont été modifiées', async () => {
    organismesDepartementsGetMock.mockResolvedValue(administrationsApiModifiees)

    const administrationsUpdated = await administrationUpdate(
      administrationsDbModifiees,
      departements
    )

    expect(administrationsUpdated.length).toEqual(1)
    expect(console.log).toHaveBeenCalled()
  })

  test('ne crée pas les administrations qui existent déjà', async () => {
    organismeDepartementGetMock.mockResolvedValue(departement)
    organismesDepartementsGetMock.mockResolvedValue(
      administrationsApiExistantes
    )

    const administrationsUpdated = await administrationUpdate(
      administrationsDbExistantes,
      departements
    )

    expect(administrationsUpdated.length).toEqual(0)
    expect(console.log).not.toHaveBeenCalled()
  })

  test("ne met rien à jour si aucun département n'est fourni", async () => {
    const administrationsUpdated = await administrationUpdate(
      administrationsDbExistantes,
      []
    )

    expect(administrationsUpdated.length).toEqual(0)
    expect(console.log).not.toHaveBeenCalled()
  })

  test("ne met rien à jour si le test de connexion à l'API administration n'est pas concluant", async () => {
    organismeDepartementGetMock.mockRejectedValue(new Error('api error'))
    organismeDepartementGetMock.mockResolvedValue(null)

    const administrationsUpdated = await administrationUpdate(
      administrationsDbExistantes,
      departements
    )

    expect(administrationsUpdated.length).toEqual(0)
    expect(console.log).not.toHaveBeenCalled()
  })
})
