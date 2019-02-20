import titresDemarchesOrdreUpdate from './titre-demarches-ordre-update'
import { titresDemarcheOctPoints } from './__mocks__/titre-demarches-ordre-update-demarches'

const titreDemarches = {}

jest.mock('../titre-demarches', () => ({
  titreDemarchesOrdreUpdate: () => titreDemarches.titreDemarchesOrdreUpdate()
}))

describe("met à jour l'ordre de toutes les démarches d'un titre", () => {
  test("met à jour l' ordre de deux démarches", async () => {
    titreDemarches.titreDemarchesOrdreUpdate = () =>
      [1, 2].map(p => Promise.resolve(p))

    expect(await titresDemarchesOrdreUpdate(titresDemarcheOctPoints)).toEqual(
      'Mise à jour: 2 ordres de démarches.'
    )
  })
})
