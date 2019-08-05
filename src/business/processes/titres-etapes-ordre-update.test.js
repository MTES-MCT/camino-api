import titresEtapesOrdreUpdate from './titres-etapes-ordre-update'
import { titreEtapeUpdate } from '../../database/queries/titres-etapes'

import {
  titresDemarchesEtapes,
  titresDemarchesEtapesVides
} from './__mocks__/titres-etapes-ordre-update-demarches'

jest.mock('../../database/queries/titres-etapes', () => ({
  titreEtapeUpdate: jest.fn().mockResolvedValue()
}))

console.log = jest.fn()

describe('ordre des étapes', () => {
  test("met à jour l'ordre de deux étapes", async () => {
    expect(await titresEtapesOrdreUpdate(titresDemarchesEtapes, [])).toEqual(
      'mise à jour: 1 étape(s) (ordre)'
    )
    expect(titreEtapeUpdate).toHaveBeenCalled()
  })

  test("ne met aucun ordre d'étape à jour", async () => {
    expect(
      await titresEtapesOrdreUpdate(titresDemarchesEtapesVides, [])
    ).toEqual('mise à jour: 0 étape(s) (ordre)')
    expect(titreEtapeUpdate).not.toHaveBeenCalled()
  })
})
