import { mocked } from 'ts-jest/utils'
import { IGeometry } from '../../types'

import { titresEtapesAreasUpdate } from './titres-etapes-areas-update'
import { titresEtapesGet } from '../../database/queries/titres-etapes'
import { foretsGet, communesGet } from '../../database/queries/territoires'

import {
  commune1,
  commune1SurfaceChangee,
  commune2,
  titresEtapesSansPoints,
  titresEtapesPoints,
  titresEtapesPointsVides,
  titresEtapesPointsMemeCommune,
  titresEtapesPointsCommuneInexistante,
  titresEtapesPointsCommuneExistante,
  foret1,
  foret1SurfaceChangee
} from './__mocks__/titres-etapes-communes-update-etapes'
import { apiGeoGet } from '../../tools/api-geo'

jest.mock('../../database/queries/titres-etapes', () => ({
  __esModule: true,
  titresEtapesCommunesUpdate: jest.fn().mockImplementation(a => a),
  titreEtapeCommuneDelete: jest.fn().mockImplementation(a => a),
  titresEtapesForetsUpdate: jest.fn().mockImplementation(a => a),
  titreEtapeForetDelete: jest.fn().mockImplementation(a => a),
  titresEtapesGet: jest.fn()
}))

jest.mock('../../database/queries/territoires', () => ({
  __esModule: true,
  communesUpsert: jest.fn().mockImplementation(a => a),
  foretsUpsert: jest.fn().mockImplementation(a => a),
  communesGet: jest.fn(),
  foretsGet: jest.fn()
}))

jest.mock('../../tools/geojson', () => ({
  __esModule: true,
  geojsonFeatureMultiPolygon: (points: IGeometry) => ({
    geometry: { coordinates: [points] }
  })
}))

jest.mock('../../tools/api-geo/index', () => ({
  apiGeoGet: jest.fn()
}))

console.info = jest.fn()
console.error = jest.fn()

const titresEtapesGetMock = mocked(titresEtapesGet, true)
const foretsGetMock = mocked(foretsGet, true)
const communesGetMock = mocked(communesGet, true)
const geoAreaGeojsonGetMock = mocked(apiGeoGet, true)

describe('mise à jour de toutes les territoires des étapes', () => {
  test('ajoute 2 communes et 1 forêt dans une étape et dans la liste de communes et des forêts', async () => {
    titresEtapesGetMock.mockResolvedValue([titresEtapesPoints])
    foretsGetMock.mockResolvedValue([])
    communesGetMock.mockResolvedValue([])
    geoAreaGeojsonGetMock.mockResolvedValue({
      communes: [commune1, commune2],
      forets: [foret1]
    })

    const result = await titresEtapesAreasUpdate()

    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesUpdated = [],
      titresEtapesCommunesDeleted = []
    ] = result.titresCommunes

    const [
      titreForetsUpdated = [],
      titresEtapesForetsUpdated = [],
      titresEtapesForetsDeleted = []
    ] = result.titresForets

    expect(titreCommunesUpdated.length).toEqual(2)
    expect(titresEtapesCommunesUpdated.length).toEqual(2)
    expect(titresEtapesCommunesDeleted.length).toEqual(0)

    expect(titreForetsUpdated.length).toEqual(1)
    expect(titresEtapesForetsUpdated.length).toEqual(1)
    expect(titresEtapesForetsDeleted.length).toEqual(0)
  })

  test("n'ajoute qu'une seule fois une commune en doublon", async () => {
    titresEtapesGetMock.mockResolvedValue([titresEtapesPointsMemeCommune])
    foretsGetMock.mockResolvedValue([])
    communesGetMock.mockResolvedValue([])
    geoAreaGeojsonGetMock.mockResolvedValue({
      communes: [commune1, commune1],
      forets: []
    })

    const result = await titresEtapesAreasUpdate()

    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesUpdated = [],
      titresEtapesCommunesDeleted = []
    ] = result.titresCommunes

    expect(titreCommunesUpdated.length).toEqual(1)
    expect(titresEtapesCommunesUpdated.length).toEqual(1)
    expect(titresEtapesCommunesDeleted.length).toEqual(0)
  })

  test("n'ajoute aucune commune dans l'étape ni dans la liste de communes", async () => {
    titresEtapesGetMock.mockResolvedValue([titresEtapesPoints])
    foretsGetMock.mockResolvedValue([])
    communesGetMock.mockResolvedValue([])
    geoAreaGeojsonGetMock.mockResolvedValue({ communes: [], forets: [] })

    const result = await titresEtapesAreasUpdate()

    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesUpdated = [],
      titresEtapesCommunesDeleted = []
    ] = result.titresCommunes

    expect(titreCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesDeleted.length).toEqual(0)
  })

  test("n'ajoute pas de commune si l'étape n'a pas de périmètre", async () => {
    titresEtapesGetMock.mockResolvedValue([titresEtapesPointsVides])
    foretsGetMock.mockResolvedValue([])
    communesGetMock.mockResolvedValue([])
    geoAreaGeojsonGetMock.mockResolvedValue({ communes: [], forets: [] })

    const result = await titresEtapesAreasUpdate()

    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesUpdated = [],
      titresEtapesCommunesDeleted = []
    ] = result.titresCommunes

    expect(titreCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesDeleted.length).toEqual(0)
  })

  test("n'ajoute pas de commune si l'étape n'a pas de la propriété `points`", async () => {
    titresEtapesGetMock.mockResolvedValue([titresEtapesSansPoints])
    foretsGetMock.mockResolvedValue([])
    communesGetMock.mockResolvedValue([])
    geoAreaGeojsonGetMock.mockResolvedValue({ communes: [], forets: [] })

    const result = await titresEtapesAreasUpdate()

    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesUpdated = [],
      titresEtapesCommunesDeleted = []
    ] = result.titresCommunes

    expect(titreCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesDeleted.length).toEqual(0)
  })

  test("n'ajoute pas de commune si elle existe déjà dans l'étape", async () => {
    titresEtapesGetMock.mockResolvedValue([titresEtapesPointsCommuneExistante])
    foretsGetMock.mockResolvedValue([foret1])
    communesGetMock.mockResolvedValue([commune1])
    geoAreaGeojsonGetMock.mockResolvedValue({
      communes: [commune1],
      forets: [foret1]
    })

    const result = await titresEtapesAreasUpdate()

    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesUpdated = [],
      titresEtapesCommunesDeleted = []
    ] = result.titresCommunes

    expect(titreCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesDeleted.length).toEqual(0)
  })

  test("met à jour la commune et la forêt dans l'étape si sa surface couverte a changé", async () => {
    titresEtapesGetMock.mockResolvedValue([titresEtapesPointsCommuneExistante])
    foretsGetMock.mockResolvedValue([foret1])
    communesGetMock.mockResolvedValue([commune1])
    geoAreaGeojsonGetMock.mockResolvedValue({
      communes: [commune1SurfaceChangee],
      forets: [foret1SurfaceChangee]
    })

    const result = await titresEtapesAreasUpdate()

    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesUpdated = [],
      titresEtapesCommunesDeleted = []
    ] = result.titresCommunes

    expect(titreCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesUpdated.length).toEqual(1)
    expect(titresEtapesCommunesDeleted.length).toEqual(0)

    const [
      titreForetsUpdated = [],
      titresEtapesForetsUpdated = [],
      titresEtapesForetsDeleted = []
    ] = result.titresForets

    expect(titreForetsUpdated.length).toEqual(0)
    expect(titresEtapesForetsUpdated.length).toEqual(1)
    expect(titresEtapesForetsDeleted.length).toEqual(0)
  })

  test("supprime une commune si l'étape ne la contient plus dans son périmètre", async () => {
    titresEtapesGetMock.mockResolvedValue([
      titresEtapesPointsCommuneInexistante
    ])
    foretsGetMock.mockResolvedValue([])
    communesGetMock.mockResolvedValue([])
    geoAreaGeojsonGetMock.mockResolvedValue({ communes: [], forets: [] })

    const result = await titresEtapesAreasUpdate()

    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesUpdated = [],
      titresEtapesCommunesDeleted = []
    ] = result.titresCommunes

    expect(titreCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesDeleted.length).toEqual(1)
  })

  test("met à jour la commune dans l'étape si sa surface couverte a changé", async () => {
    titresEtapesGetMock.mockResolvedValue([titresEtapesPointsCommuneExistante])
    foretsGetMock.mockResolvedValue([])
    communesGetMock.mockResolvedValue([commune1])
    geoAreaGeojsonGetMock.mockResolvedValue({
      communes: [commune1SurfaceChangee],
      forets: []
    })

    const result = await titresEtapesAreasUpdate()

    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesUpdated = [],
      titresEtapesCommunesDeleted = []
    ] = result.titresCommunes

    expect(titreCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesUpdated.length).toEqual(1)
    expect(titresEtapesCommunesDeleted.length).toEqual(0)
  })

  test("retourne un message d'erreur si l'API Géo communes ne répond pas", async () => {
    titresEtapesGetMock.mockResolvedValue([titresEtapesPointsVides])
    foretsGetMock.mockResolvedValue([])
    communesGetMock.mockResolvedValue([])
    geoAreaGeojsonGetMock.mockResolvedValue(null)

    const result = await titresEtapesAreasUpdate()

    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesUpdated = [],
      titresEtapesCommunesDeleted = []
    ] = result.titresCommunes
    expect(titreCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesDeleted.length).toEqual(0)
    expect(geoAreaGeojsonGetMock).toHaveBeenCalled()

    expect(console.error).toHaveBeenCalled()
  })
})
