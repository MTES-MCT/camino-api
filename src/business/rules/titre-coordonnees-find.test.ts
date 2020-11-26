import titreCoordonneesFind from './titre-coordonnees-find'

import { titrePoints } from './__mocks__/titre-coordonnees-find'

describe("coordonnées d'un titre", () => {
  test("retourne les coordonnées d'un titre", () => {
    expect(titreCoordonneesFind(titrePoints)).toMatchObject({ x: 0.5, y: 1 })
  })
})
