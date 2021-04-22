import { mocked } from 'ts-jest/utils'

import { titresDemarchesPublicUpdate } from './titres-demarches-public-update'
import { titresGet } from '../../database/queries/titres'

import {
  titresDemarchesPublicModifie,
  titresDemarchesPublicIdentique
} from './__mocks__/titres-demarches-public-update-demarches'

jest.mock('../../database/queries/titres', () => ({
  titresGet: jest.fn()
}))

jest.mock('../../database/queries/titres-demarches', () => ({
  titreDemarcheUpdate: jest.fn().mockResolvedValue(true)
}))

const titresGetMock = mocked(titresGet, true)

console.info = jest.fn()

describe("public des démarches d'un titre", () => {
  test("met à jour la publicité d'une démarche", async () => {
    titresGetMock.mockResolvedValue(titresDemarchesPublicModifie)
    const titresDemarchesPublicUpdated = await titresDemarchesPublicUpdate()

    expect(titresDemarchesPublicUpdated.length).toEqual(1)
  })

  test("ne met pas à jour la publicité d'une démarche", async () => {
    titresGetMock.mockResolvedValue(titresDemarchesPublicIdentique)
    const titresDemarchesPublicUpdated = await titresDemarchesPublicUpdate()

    expect(titresDemarchesPublicUpdated.length).toEqual(0)
  })
})
