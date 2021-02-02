import { mocked } from 'ts-jest/utils'
import { titresEtapesOrdreUpdate } from './titres-etapes-ordre-update'
import { titreEtapeUpdate } from '../../database/queries/titres-etapes'
import { titresDemarchesGet } from '../../database/queries/titres-demarches'

import {
  titresDemarchesEtapes,
  titresDemarchesEtapesVides
} from './__mocks__/titres-etapes-ordre-update-demarches'
import TitresDemarches from '../../database/models/titres-demarches'

jest.mock('../../database/queries/titres-etapes', () => ({
  titreEtapeUpdate: jest.fn().mockResolvedValue(true)
}))

jest.mock('../../database/queries/titres-demarches', () => ({
  titresDemarchesGet: jest.fn()
}))

const titresDemarchesGetMock = mocked(titresDemarchesGet, true)

console.info = jest.fn()

describe('ordre des étapes', () => {
  test("met à jour l'ordre de deux étapes", async () => {
    titresDemarchesGetMock.mockResolvedValue(titresDemarchesEtapes)
    const titresEtapesUpdated = await titresEtapesOrdreUpdate()
    expect(titresEtapesUpdated.length).toEqual(1)
    expect(titreEtapeUpdate).toHaveBeenCalled()
  })

  test("ne met aucun ordre d'étape à jour", async () => {
    titresDemarchesGetMock.mockResolvedValue(titresDemarchesEtapesVides)
    const titresEtapesUpdated = await titresEtapesOrdreUpdate()
    expect(titresEtapesUpdated.length).toEqual(0)
    expect(titreEtapeUpdate).not.toHaveBeenCalled()
  })

  test("ne met aucun ordre d'étape à jour (démarche sans étape)", async () => {
    titresDemarchesGetMock.mockResolvedValue([{} as TitresDemarches])
    const titresEtapesUpdated = await titresEtapesOrdreUpdate()

    expect(titresEtapesUpdated.length).toEqual(0)
    expect(titreEtapeUpdate).not.toHaveBeenCalled()
  })
})
