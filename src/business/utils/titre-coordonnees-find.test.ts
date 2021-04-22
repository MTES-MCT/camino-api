import { mocked } from 'ts-jest/utils'

import { titreCoordonneesFind } from './titre-coordonnees-find'
import { geojsonCenter } from '../../tools/geojson'

import { titrePoints } from './__mocks__/titre-coordonnees-find'

jest.mock('../../tools/geojson', () => ({
  geojsonCenter: jest.fn()
}))

const geojsonCenterMock = mocked(geojsonCenter, true)

describe("coordonnées d'un titre", () => {
  test("retourne les coordonnées d'un titre", () => {
    geojsonCenterMock.mockReturnValue([0.5, 1])
    expect(titreCoordonneesFind(titrePoints)).toMatchObject({ x: 0.5, y: 1 })
  })

  test("retourne null si le titre n'a pas de points", () => {
    expect(titreCoordonneesFind([])).toBeNull()
    expect(titreCoordonneesFind(null)).toBeNull()
  })
})
