import { mocked } from 'ts-jest/utils'
import { titresStatutIdsUpdate } from './titres-statut-ids-update'
import { titresGet } from '../../database/queries/titres'

import {
  titresValideStatutIdAJour,
  titresEchuStatutIdObselete
} from './__mocks__/titres-statut-ids-update-titres'

jest.mock('../../database/queries/titres', () => ({
  __esModule: true,
  titreUpdate: jest.fn().mockResolvedValue(true),
  titresGet: jest.fn()
}))

const titresGetMock = mocked(titresGet, true)

console.info = jest.fn()

describe("statut d'un titre", () => {
  test('met à jour un titre si son statut est obsolète', async () => {
    titresGetMock.mockResolvedValue(titresEchuStatutIdObselete)
    const titresUpdatedRequests = await titresStatutIdsUpdate()

    expect(titresUpdatedRequests.length).toEqual(1)
  })

  test("ne met pas à jour le statut d'un titre", async () => {
    titresGetMock.mockResolvedValue(titresValideStatutIdAJour)
    const titresUpdatedRequests = await titresStatutIdsUpdate()

    expect(titresUpdatedRequests.length).toEqual(0)
  })
})
