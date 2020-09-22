import { mocked } from 'ts-jest/utils'
import { IArea, IGeometry, ITitreEtape } from '../../types'

import {
  commune1,
  commune1SurfaceChangee,
  commune2,
  titresEtapesSansPoints,
  titresEtapesPoints,
  titresEtapesPointsVides,
  titresEtapesPointsMemeCommune,
  titresEtapesPointsCommuneInexistante,
  titresEtapesPointsCommuneExistante
} from './__mocks__/titres-etapes-communes-update-etapes'
import { titresEtapesAreasUpdate } from './titres-etapes-areas-update'
import { geoAreaGeojsonGet } from '../../tools/api-communes'

jest.mock('../../database/queries/titres-etapes', () => ({
  __esModule: true,
  titresEtapesCommunesUpdate: jest.fn().mockImplementation(a => a),
  titreEtapeCommuneDelete: jest.fn().mockImplementation(a => a)
}))

jest.mock('../../database/queries/territoires', () => ({
  __esModule: true,
  communesUpsert: jest.fn().mockImplementation(a => a)
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

const apiCommunesMocked = mocked(geoAreaGeojsonGet, true)

describe('mise à jour de toutes les territoires des étapes', () => {
  test('ajoute 2 communes dans une étape et dans la liste de communes', async () => {
    apiCommunesMocked.mockResolvedValue({
      communes: [commune1, commune2],
      forets: []
    })

    const result = await titresEtapesAreasUpdate([titresEtapesPoints], [], [])

    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesUpdated = [],
      titresEtapesCommunesDeleted = []
    ] = result.communes

    expect(titreCommunesUpdated.length).toEqual(2)
    expect(titresEtapesCommunesUpdated.length).toEqual(2)
    expect(titresEtapesCommunesDeleted.length).toEqual(0)
    expect(console.info).toHaveBeenCalledTimes(3)
  })

  test("n'ajoute qu'une seule fois une commune en doublon", async () => {
    apiCommunesMocked.mockResolvedValue({
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
    apiCommunesMocked.mockResolvedValue({ communes: [], forets: [] })

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
    apiCommunesMocked.mockResolvedValue({ communes: [], forets: [] })

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
    apiCommunesMocked.mockResolvedValue({ communes: [], forets: [] })

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
    apiCommunesMocked.mockResolvedValue({ communes: [commune1], forets: [] })

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
    expect(titresEtapesCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesDeleted.length).toEqual(0)
    expect(console.info).not.toHaveBeenCalled()
  })

  test("met à jour la commune dans l'étape si sa surface couverte a changé", async () => {
    apiCommunesMocked.mockResolvedValue({
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

  test("supprime une commune si l'étape ne la contient plus dans son périmètre", async () => {
    apiCommunesMocked.mockResolvedValue({ communes: [], forets: [] })

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
    apiCommunesMocked.mockResolvedValue({
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
    apiCommunesMocked.mockResolvedValue(null)

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
    expect(apiCommunesMocked).toHaveBeenCalled()
    expect(console.info).not.toHaveBeenCalled()
    expect(console.warn).toHaveBeenCalled()
  })
})
