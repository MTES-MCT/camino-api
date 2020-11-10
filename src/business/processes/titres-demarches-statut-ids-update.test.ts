import { mocked } from 'ts-jest/utils'
import titresDemarcheStatutIdUpdate from './titres-demarches-statut-ids-update'
import { titresGet } from '../../database/queries/titres'

import {
  titresDemarchesStatutModifie,
  titresDemarchesStatutIdentique,
  titresDemarchesSansEtape
} from './__mocks__/titres-demarches-statut-ids-update-demarches'

jest.mock('../../database/queries/titres-demarches', () => ({
  titreDemarcheUpdate: jest.fn().mockResolvedValue(true)
}))

jest.mock('../../database/queries/titres', () => ({
  __esModule: true,
  titresGet: jest.fn()
}))

const titresGetMock = mocked(titresGet, true)

console.info = jest.fn()

describe("statut des démarches d'un titre", () => {
  test("met à jour le statut d'une démarche", async () => {
    titresGetMock.mockResolvedValue(titresDemarchesStatutModifie)
    const titresDemarchesStatutUpdated = await titresDemarcheStatutIdUpdate()

    expect(titresDemarchesStatutUpdated.length).toEqual(1)
  })

  test("ne met pas à jour le statut d'une démarche", async () => {
    titresGetMock.mockResolvedValue(titresDemarchesStatutIdentique)
    const titresDemarchesStatutUpdated = await titresDemarcheStatutIdUpdate()

    expect(titresDemarchesStatutUpdated.length).toEqual(0)
  })

  test("ne met pas à jour le statut d'une démarche sans étape", async () => {
    titresGetMock.mockResolvedValue(titresDemarchesSansEtape)
    const titresDemarchesStatutUpdated = await titresDemarcheStatutIdUpdate()

    expect(titresDemarchesStatutUpdated.length).toEqual(0)
  })
})
