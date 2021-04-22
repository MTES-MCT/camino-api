import { mocked } from 'ts-jest/utils'

import { administrationsUpdate } from './administrations-update'
import {
  organismeDepartementGet,
  organismesDepartementsGet
} from '../../tools/api-administrations/index'

import {
  administrationApiTest,
  administrationsDbCreees,
  administrationsApiCreees,
  administrationsDbModifiees,
  administrationsApiModifiees,
  administrationsDbExistantes,
  administrationsApiExistantes
} from './__mocks__/administrations-update'

import { administrationsGet } from '../../database/queries/administrations'

jest.mock('../../database/queries/administrations', () => ({
  __esModule: true,
  administrationsUpsert: jest.fn(),
  administrationsGet: jest.fn()
}))

jest.mock('../../tools/api-administrations/index', () => ({
  __esModule: true,
  organismeDepartementGet: jest.fn(),
  organismesDepartementsGet: jest.fn()
}))

const administrationsGetMock = mocked(administrationsGet, true)
const organismeDepartementGetMock = mocked(organismeDepartementGet, true)
const organismesDepartementsGetMock = mocked(organismesDepartementsGet, true)

console.info = jest.fn()

describe('administrations', () => {
  test("ne crée pas les administrations qui n'ont pas de département", async () => {
    administrationsGetMock.mockResolvedValue(administrationsDbCreees)
    organismeDepartementGetMock.mockResolvedValue(administrationApiTest)
    organismesDepartementsGetMock.mockResolvedValue(administrationsApiCreees)

    const administrationsUpdated = await administrationsUpdate()

    expect(administrationsUpdated.length).toEqual(0)
  })

  test('met à jour les administrations qui ont été modifiées', async () => {
    administrationsGetMock.mockResolvedValue(administrationsDbModifiees)
    organismeDepartementGetMock.mockResolvedValue(administrationApiTest)
    organismesDepartementsGetMock.mockResolvedValue(administrationsApiModifiees)

    const administrationsUpdated = await administrationsUpdate()

    expect(administrationsUpdated.length).toEqual(1)
  })

  test('ne crée pas les administrations qui existent déjà', async () => {
    administrationsGetMock.mockResolvedValue(administrationsDbExistantes)
    organismeDepartementGetMock.mockResolvedValue(administrationApiTest)
    organismesDepartementsGetMock.mockResolvedValue(
      administrationsApiExistantes
    )

    const administrationsUpdated = await administrationsUpdate()

    expect(administrationsUpdated.length).toEqual(0)
  })

  test("ne met rien à jour si le test de connexion à l'API administration n'est pas concluant", async () => {
    administrationsGetMock.mockResolvedValue(administrationsDbExistantes)
    organismeDepartementGetMock.mockRejectedValue(new Error('api error'))
    organismeDepartementGetMock.mockResolvedValue(null)

    const administrationsUpdated = await administrationsUpdate()

    expect(administrationsUpdated.length).toEqual(0)
  })
})
