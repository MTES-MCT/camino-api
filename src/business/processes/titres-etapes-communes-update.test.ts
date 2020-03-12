import { mocked } from 'ts-jest/utils'
import { IGeometry } from '../../types'

import titresEtapeCommunesUpdate from './titres-etapes-communes-update'
import apiCommunes from '../../tools/api-communes/index'

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

jest.mock('../../database/queries/territoires', () => ({
  __esModule: true,
  communesUpsert: jest.fn().mockImplementation(a => a)
}))

jest.mock('../../database/queries/titres-etapes', () => ({
  __esModule: true,
  titresEtapesCommunesUpdate: jest.fn().mockImplementation(a => a),
  titreEtapeCommuneDelete: jest.fn().mockImplementation(a => a)
}))

jest.mock('../../tools/geojson', () => ({
  __esModule: true,
  geojsonFeatureMultiPolygon: (points: IGeometry) => ({
    geometry: { coordinates: [points] }
  })
}))

jest.mock('../../tools/api-communes/index', () => ({
  default: jest.fn()
}))

console.log = jest.fn()

const apiCommunesMocked = mocked(
  apiCommunes,
  true
)

describe("communes et communes d'étapes", () => {
  test('ajoute 2 communes dans une étape et dans la liste de communes', async () => {
    apiCommunesMocked.mockResolvedValue([commune1, commune2])

    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesUpdated = [],
      titresEtapesCommunesDeleted = []
    ] = await titresEtapeCommunesUpdate(titresEtapesPoints, [])

    expect(titreCommunesUpdated.length).toEqual(2)
    expect(titresEtapesCommunesUpdated.length).toEqual(2)
    expect(titresEtapesCommunesDeleted.length).toEqual(0)
    expect(console.log).toHaveBeenCalledTimes(3)
  })

  test("n'ajoute qu'une seule fois une commune en doublon", async () => {
    apiCommunesMocked.mockResolvedValue([commune1, commune1])

    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesUpdated = [],
      titresEtapesCommunesDeleted = []
    ] = await titresEtapeCommunesUpdate(titresEtapesPointsMemeCommune, [])

    expect(titreCommunesUpdated.length).toEqual(1)
    expect(titresEtapesCommunesUpdated.length).toEqual(1)
    expect(titresEtapesCommunesDeleted.length).toEqual(0)
    expect(console.log).toHaveBeenCalledTimes(2)
  })

  test("n'ajoute aucune commune dans l'étape ni dans la liste de communes", async () => {
    apiCommunesMocked.mockResolvedValue([])

    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesUpdated = [],
      titresEtapesCommunesDeleted = []
    ] = await titresEtapeCommunesUpdate(titresEtapesPoints, [])

    expect(titreCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesDeleted.length).toEqual(0)
    expect(console.log).not.toHaveBeenCalled()
  })

  test("n'ajoute pas de commune si l'étape n'a pas de périmètre", async () => {
    apiCommunesMocked.mockResolvedValue([])

    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesUpdated = [],
      titresEtapesCommunesDeleted = []
    ] = await titresEtapeCommunesUpdate(titresEtapesPointsVides, [])

    expect(titreCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesDeleted.length).toEqual(0)
    expect(console.log).not.toHaveBeenCalled()
  })

  test("n'ajoute pas de commune si l'étape n'a pas de la propriété `points`", async () => {
    apiCommunesMocked.mockResolvedValue([])

    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesUpdated = [],
      titresEtapesCommunesDeleted = []
    ] = await titresEtapeCommunesUpdate(titresEtapesSansPoints, [])

    expect(titreCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesDeleted.length).toEqual(0)
    expect(console.log).not.toHaveBeenCalled()
  })

  test("n'ajoute pas de commune si elle existe déjà dans l'étape", async () => {
    apiCommunesMocked.mockResolvedValue([commune1])

    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesUpdated = [],
      titresEtapesCommunesDeleted = []
    ] = await titresEtapeCommunesUpdate(
      titresEtapesPointsCommuneExistante,
      [commune1]
    )

    expect(titreCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesDeleted.length).toEqual(0)
    expect(console.log).not.toHaveBeenCalled()
  })

  test("met à jour la commune dans l'étape si sa surface couverte a changé", async () => {
    apiCommunesMocked.mockResolvedValue([commune1SurfaceChangee])

    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesUpdated = [],
      titresEtapesCommunesDeleted = []
    ] = await titresEtapeCommunesUpdate(
      titresEtapesPointsCommuneExistante,
      [commune1SurfaceChangee]
    )

    expect(titreCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesUpdated.length).toEqual(1)
    expect(titresEtapesCommunesDeleted.length).toEqual(0)
    expect(console.log).toHaveBeenCalled()
  })

  test("supprime une commune si l'étape ne la contient plus dans son périmètre", async () => {
    apiCommunesMocked.mockResolvedValue([commune1])

    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesUpdated = [],
      titresEtapesCommunesDeleted = []
    ] = await titresEtapeCommunesUpdate(titresEtapesPointsCommuneInexistante, [])

    expect(titreCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesDeleted.length).toEqual(1)
    expect(console.log).toHaveBeenCalled()
  })

  test("retourne un message d'erreur si l'API Géo communes ne répond pas", async () => {
    apiCommunesMocked.mockResolvedValue(null)

    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesUpdated = [],
      titresEtapesCommunesDeleted = []
    ] = await titresEtapeCommunesUpdate(titresEtapesPointsVides, [])

    expect(titreCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesDeleted.length).toEqual(0)
    expect(apiCommunesMocked).toHaveBeenCalled()
    expect(console.log).not.toHaveBeenCalled()
  })
})
