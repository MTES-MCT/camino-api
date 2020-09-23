import { mocked } from 'ts-jest/utils'
import { IGeometry } from '../../types'

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
import { titresEtapesAreasUpdate } from './titres-etapes-areas-update'
import { geoAreaGeojsonGet } from '../../tools/api-communes'

jest.mock('../../database/queries/titres-etapes', () => ({
  __esModule: true,
  titresEtapesCommunesUpdate: jest.fn().mockImplementation(a => a),
  titreEtapeCommuneDelete: jest.fn().mockImplementation(a => a),
  titresEtapesForetsUpdate: jest.fn().mockImplementation(a => a),
  titreEtapeForetDelete: jest.fn().mockImplementation(a => a)
}))

jest.mock('../../database/queries/territoires', () => ({
  __esModule: true,
  communesUpsert: jest.fn().mockImplementation(a => a),
  foretsUpsert: jest.fn().mockImplementation(a => a)
}))

jest.mock('../../tools/geojson', () => ({
  __esModule: true,
  geojsonFeatureMultiPolygon: (points: IGeometry) => ({
    geometry: { coordinates: [points] }
  })
}))

jest.mock('../../tools/api-communes/index', () => ({
  geoAreaGeojsonGet: jest.fn()
}))

console.info = jest.fn()
console.warn = jest.fn()

const geoAreaGeojsonGetMocked = mocked(geoAreaGeojsonGet, true)

describe('mise à jour de toutes les territoires des étapes', () => {
  test('ajoute 2 communes et 1 forêt dans une étape et dans la liste de communes et des forêts', async () => {
    geoAreaGeojsonGetMocked.mockResolvedValue({
      communes: [commune1, commune2],
      forets: [foret1]
    })

    const result = await titresEtapesAreasUpdate([titresEtapesPoints], [], [])

    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesUpdated = [],
      titresEtapesCommunesDeleted = []
    ] = result.communes

    const [
      titreForetsUpdated = [],
      titresEtapesForetsUpdated = [],
      titresEtapesForetsDeleted = []
    ] = result.forets

    expect(titreCommunesUpdated.length).toEqual(2)
    expect(titresEtapesCommunesUpdated.length).toEqual(2)
    expect(titresEtapesCommunesDeleted.length).toEqual(0)

    expect(titreForetsUpdated.length).toEqual(1)
    expect(titresEtapesForetsUpdated.length).toEqual(1)
    expect(titresEtapesForetsDeleted.length).toEqual(0)

    expect(console.info).toHaveBeenCalledTimes(5)
  })

  test("n'ajoute qu'une seule fois une commune en doublon", async () => {
    geoAreaGeojsonGetMocked.mockResolvedValue({
      communes: [commune1, commune1],
      forets: []
    })

    const result = await titresEtapesAreasUpdate(
      [titresEtapesPointsMemeCommune],
      [],
      []
    )

    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesUpdated = [],
      titresEtapesCommunesDeleted = []
    ] = result.communes

    expect(titreCommunesUpdated.length).toEqual(1)
    expect(titresEtapesCommunesUpdated.length).toEqual(1)
    expect(titresEtapesCommunesDeleted.length).toEqual(0)
    expect(console.info).toHaveBeenCalledTimes(2)
  })

  test("n'ajoute aucune commune dans l'étape ni dans la liste de communes", async () => {
    geoAreaGeojsonGetMocked.mockResolvedValue({ communes: [], forets: [] })

    const result = await titresEtapesAreasUpdate([titresEtapesPoints], [], [])

    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesUpdated = [],
      titresEtapesCommunesDeleted = []
    ] = result.communes

    expect(titreCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesDeleted.length).toEqual(0)
    expect(console.info).not.toHaveBeenCalled()
  })

  test("n'ajoute pas de commune si l'étape n'a pas de périmètre", async () => {
    geoAreaGeojsonGetMocked.mockResolvedValue({ communes: [], forets: [] })

    const result = await titresEtapesAreasUpdate(
      [titresEtapesPointsVides],
      [],
      []
    )

    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesUpdated = [],
      titresEtapesCommunesDeleted = []
    ] = result.communes

    expect(titreCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesDeleted.length).toEqual(0)
    expect(console.info).not.toHaveBeenCalled()
  })

  test("n'ajoute pas de commune si l'étape n'a pas de la propriété `points`", async () => {
    geoAreaGeojsonGetMocked.mockResolvedValue({ communes: [], forets: [] })

    const result = await titresEtapesAreasUpdate(
      [titresEtapesSansPoints],
      [],
      []
    )

    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesUpdated = [],
      titresEtapesCommunesDeleted = []
    ] = result.communes

    expect(titreCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesDeleted.length).toEqual(0)
    expect(console.info).not.toHaveBeenCalled()
  })

  test("n'ajoute pas de commune si elle existe déjà dans l'étape", async () => {
    geoAreaGeojsonGetMocked.mockResolvedValue({
      communes: [commune1],
      forets: [foret1]
    })

    const result = await titresEtapesAreasUpdate(
      [titresEtapesPointsCommuneExistante],
      [commune1],
      [foret1]
    )

    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesUpdated = [],
      titresEtapesCommunesDeleted = []
    ] = result.communes

    expect(titreCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesDeleted.length).toEqual(0)
    expect(console.info).not.toHaveBeenCalled()
  })

  test("met à jour la commune et la forêt dans l'étape si sa surface couverte a changé", async () => {
    geoAreaGeojsonGetMocked.mockResolvedValue({
      communes: [commune1SurfaceChangee],
      forets: [foret1SurfaceChangee]
    })

    const result = await titresEtapesAreasUpdate(
      [titresEtapesPointsCommuneExistante],
      [commune1],
      [foret1]
    )

    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesUpdated = [],
      titresEtapesCommunesDeleted = []
    ] = result.communes

    expect(titreCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesUpdated.length).toEqual(1)
    expect(titresEtapesCommunesDeleted.length).toEqual(0)

    const [
      titreForetsUpdated = [],
      titresEtapesForetsUpdated = [],
      titresEtapesForetsDeleted = []
    ] = result.forets

    expect(titreForetsUpdated.length).toEqual(0)
    expect(titresEtapesForetsUpdated.length).toEqual(1)
    expect(titresEtapesForetsDeleted.length).toEqual(0)

    expect(console.info).toHaveBeenCalled()
  })

  test("supprime une commune si l'étape ne la contient plus dans son périmètre", async () => {
    geoAreaGeojsonGetMocked.mockResolvedValue({ communes: [], forets: [] })

    const result = await titresEtapesAreasUpdate(
      [titresEtapesPointsCommuneInexistante],
      [],
      []
    )

    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesUpdated = [],
      titresEtapesCommunesDeleted = []
    ] = result.communes

    expect(titreCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesDeleted.length).toEqual(1)
    expect(console.info).toHaveBeenCalled()
  })

  test("met à jour la commune dans l'étape si sa surface couverte a changé", async () => {
    geoAreaGeojsonGetMocked.mockResolvedValue({
      communes: [commune1SurfaceChangee],
      forets: []
    })

    const result = await titresEtapesAreasUpdate(
      [titresEtapesPointsCommuneExistante],
      [commune1],
      []
    )

    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesUpdated = [],
      titresEtapesCommunesDeleted = []
    ] = result.communes

    expect(titreCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesUpdated.length).toEqual(1)
    expect(titresEtapesCommunesDeleted.length).toEqual(0)
    expect(console.info).toHaveBeenCalled()
  })

  test("retourne un message d'erreur si l'API Géo communes ne répond pas", async () => {
    geoAreaGeojsonGetMocked.mockResolvedValue(null)

    const result = await titresEtapesAreasUpdate(
      [titresEtapesPointsVides],
      [],
      []
    )

    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesUpdated = [],
      titresEtapesCommunesDeleted = []
    ] = result.communes
    expect(titreCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesDeleted.length).toEqual(0)
    expect(geoAreaGeojsonGetMocked).toHaveBeenCalled()
    expect(console.info).not.toHaveBeenCalled()
    expect(console.warn).toHaveBeenCalled()
  })
})
