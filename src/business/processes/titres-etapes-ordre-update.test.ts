import { ITitreDemarche } from '../../types'
import titresEtapesOrdreUpdate from './titres-etapes-ordre-update'
import { titreEtapeUpdate } from '../../database/queries/titres-etapes'

import {
  titresDemarchesEtapes,
  titresDemarchesEtapesVides
} from './__mocks__/titres-etapes-ordre-update-demarches'

jest.mock('../../database/queries/titres-etapes', () => ({
  titreEtapeUpdate: jest.fn().mockResolvedValue(true)
}))

console.log = jest.fn()

describe('ordre des étapes', () => {
  test("met à jour l'ordre de deux étapes", async () => {
    const titresEtapesUpdated = await titresEtapesOrdreUpdate(
      titresDemarchesEtapes
    )
    expect(titresEtapesUpdated.length).toEqual(1)
    expect(titreEtapeUpdate).toHaveBeenCalled()
  })

  test("ne met aucun ordre d'étape à jour", async () => {
    const titresEtapesUpdated = await titresEtapesOrdreUpdate(
      titresDemarchesEtapesVides
    )
    expect(titresEtapesUpdated.length).toEqual(0)
    expect(titreEtapeUpdate).not.toHaveBeenCalled()
  })

  test("ne met aucun ordre d'étape à jour (démarche sans étape)", async () => {
    const titresEtapesUpdated = await titresEtapesOrdreUpdate([
      ({} as unknown) as ITitreDemarche
    ])
    expect(titresEtapesUpdated.length).toEqual(0)
    expect(titreEtapeUpdate).not.toHaveBeenCalled()
  })
})
