import { mocked } from 'ts-jest/utils'
import titreCoordonneesFind from './titre-coordonnees-find'
import { geojsonFeatureMultiPolygon } from '../../tools/geojson'

import { titrePoints, titreGeojson } from './__mocks__/titre-coordonnees-find'

jest.mock('../../tools/geojson', () => ({
  geojsonFeatureMultiPolygon: jest.fn()
}))

const geojsonFeatureMultiPolygonMock = mocked(geojsonFeatureMultiPolygon, true)

describe("coordonnées d'un titre", () => {
  test("retourne les coordonnées d'un titre", () => {
    geojsonFeatureMultiPolygonMock.mockReturnValue(titreGeojson)
    expect(titreCoordonneesFind(titrePoints)).toMatchObject({ x: 0.5, y: 1 })
  })

  test("retourne null si le titre n'a pas de points", () => {
    expect(titreCoordonneesFind([])).toBeNull()
    expect(titreCoordonneesFind(null)).toBeNull()
  })
})
