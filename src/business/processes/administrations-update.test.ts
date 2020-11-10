import { mocked } from 'ts-jest/utils'
import administrationUpdate from './administrations-update'
import {
  organismeDepartementGet,
  organismesDepartementsGet
} from '../../tools/api-administrations/index'

import {
  departements,
  administrationApiTest,
  administrationsDbCreees,
  administrationsApiCreees,
  administrationsDbModifiees,
  administrationsApiModifiees,
  administrationsDbExistantes,
  administrationsApiExistantes
} from './__mocks__/administrations-update'

import { administrationsGet } from '../../database/queries/administrations'
import { departementsGet } from '../../database/queries/territoires'

jest.mock('../../database/queries/territoires', () => ({
  __esModule: true,
  departementsGet: jest.fn()
}))

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
const departementsGetMock = mocked(departementsGet, true)
const organismeDepartementGetMock = mocked(organismeDepartementGet, true)
const organismesDepartementsGetMock = mocked(organismesDepartementsGet, true)

console.info = jest.fn()

describe('administrations', () => {
  test("crée les administrations si elles n'existent pas", async () => {
    administrationsGetMock.mockResolvedValue(administrationsDbCreees)
    departementsGetMock.mockResolvedValue(departements)
    organismeDepartementGetMock.mockResolvedValue(administrationApiTest)
    organismesDepartementsGetMock.mockResolvedValue(administrationsApiCreees)

    const administrationsUpdated = await administrationUpdate()

    expect(administrationsUpdated.length).toEqual(1)
  })

  test('met à jour les administrations qui ont été modifiées', async () => {
    administrationsGetMock.mockResolvedValue(administrationsDbModifiees)
    departementsGetMock.mockResolvedValue(departements)
    organismesDepartementsGetMock.mockResolvedValue(administrationsApiModifiees)

    const administrationsUpdated = await administrationUpdate()

    expect(administrationsUpdated.length).toEqual(1)
  })

  test('ne crée pas les administrations qui existent déjà', async () => {
    administrationsGetMock.mockResolvedValue(administrationsDbExistantes)
    departementsGetMock.mockResolvedValue(departements)
    organismeDepartementGetMock.mockResolvedValue(administrationApiTest)
    organismesDepartementsGetMock.mockResolvedValue(
      administrationsApiExistantes
    )

    const administrationsUpdated = await administrationUpdate()

    expect(administrationsUpdated.length).toEqual(0)
  })

  test("ne met rien à jour si aucun département n'est fourni", async () => {
    administrationsGetMock.mockResolvedValue(administrationsDbCreees)
    departementsGetMock.mockResolvedValue([])
    const administrationsUpdated = await administrationUpdate()

    expect(administrationsUpdated.length).toEqual(0)
  })

  test("ne met rien à jour si le test de connexion à l'API administration n'est pas concluant", async () => {
    administrationsGetMock.mockResolvedValue(administrationsDbExistantes)
    departementsGetMock.mockResolvedValue(departements)
    organismeDepartementGetMock.mockRejectedValue(new Error('api error'))
    organismeDepartementGetMock.mockResolvedValue(null)

    const administrationsUpdated = await administrationUpdate()

    expect(administrationsUpdated.length).toEqual(0)
  })
})
