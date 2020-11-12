import { mocked } from 'ts-jest/utils'

import titresDemarchesOrdreUpdate from './titres-demarches-ordre-update'
import { titresGet } from '../../database/queries/titres'

import {
  titresDemarchesDesordonnees,
  titresDemarchesOrdonnees
} from './__mocks__/titres-demarches-ordre-update-demarches'

jest.mock('../../database/queries/titres', () => ({
  titresGet: jest.fn()
}))

jest.mock('../../database/queries/titres-demarches', () => ({
  titreDemarcheUpdate: jest.fn().mockResolvedValue(true)
}))

const titresGetMock = mocked(titresGet, true)

console.info = jest.fn()

describe('ordre des démarches', () => {
  test("met à jour l'ordre de deux démarches", async () => {
    titresGetMock.mockResolvedValue(titresDemarchesDesordonnees)
    const titresDemarchesOrdreUpdated = await titresDemarchesOrdreUpdate()
    expect(titresDemarchesOrdreUpdated.length).toEqual(2)
  })

  test('ne met à jour aucune démarche', async () => {
    titresGetMock.mockResolvedValue(titresDemarchesOrdonnees)
    const titresDemarchesOrdreUpdated = await titresDemarchesOrdreUpdate()
    expect(titresDemarchesOrdreUpdated.length).toEqual(0)
  })
})
