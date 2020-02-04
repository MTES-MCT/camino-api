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
import { IAdministrations } from '../../types'

jest.mock('../../database/queries/administrations', () => ({
  __esModule: true,
  administrationsUpsert: jest.fn()
}))

jest.mock('../../tools/api-administrations/index', () => ({
  __esModule: true,
  organismeDepartementGet: jest.fn(),
  organismesDepartementsGet: jest.fn()
}))

// TODO: supprimer le typage de fonction quand organismeDepartementGet sera en ts
const organismeDepartementGetMock = mocked(
  organismeDepartementGet as (
    departementId: string,
    nom: string
  ) => Promise<IAdministrations | null>,
  true
)
const organismesDepartementsGetMock = mocked(organismesDepartementsGet, true)

console.log = jest.fn()

describe('administrations', () => {
  test("crée les administrations si elles n'existent pas", async () => {
    organismeDepartementGetMock.mockResolvedValue(administrationApiTest)
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
    organismeDepartementGetMock.mockResolvedValue(administrationApiTest)
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
