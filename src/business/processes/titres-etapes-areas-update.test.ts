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
import {
  titresEtapesAreasUpdate,
  titresEtapesCommunesUpdate
} from './titres-etapes-areas-update'
import { communesGeojsonApiGet } from '../../tools/api-communes'

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
  communesGeojsonApiGet: jest.fn()
}))

console.info = jest.fn()
console.warn = jest.fn()

const apiCommunesMocked = mocked(communesGeojsonApiGet, true)

const titreEtapesAreasIndexGet = (
  titresEtapes: ITitreEtape,
  communes: IArea[]
) => ({ [titresEtapes.id]: { titreEtape: titresEtapes, areas: { communes } } })

describe("communes et communes d'étapes", () => {
  test('ajoute 2 communes dans une étape et dans la liste de communes', async () => {
    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesUpdated = [],
      titresEtapesCommunesDeleted = []
    ] = await titresEtapesCommunesUpdate(
      titreEtapesAreasIndexGet(titresEtapesPoints, [commune1, commune2]),
      []
    )

    expect(titreCommunesUpdated.length).toEqual(2)
    expect(titresEtapesCommunesUpdated.length).toEqual(2)
    expect(titresEtapesCommunesDeleted.length).toEqual(0)
    expect(console.info).toHaveBeenCalledTimes(3)
  })

  test("n'ajoute qu'une seule fois une commune en doublon", async () => {
    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesUpdated = [],
      titresEtapesCommunesDeleted = []
    ] = await titresEtapesCommunesUpdate(
      titreEtapesAreasIndexGet(titresEtapesPointsMemeCommune, [
        commune1,
        commune1
      ]),
      []
    )

    expect(titreCommunesUpdated.length).toEqual(1)
    expect(titresEtapesCommunesUpdated.length).toEqual(1)
    expect(titresEtapesCommunesDeleted.length).toEqual(0)
    expect(console.info).toHaveBeenCalledTimes(2)
  })

  test("n'ajoute aucune commune dans l'étape ni dans la liste de communes", async () => {
    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesUpdated = [],
      titresEtapesCommunesDeleted = []
    ] = await titresEtapesCommunesUpdate(
      titreEtapesAreasIndexGet(titresEtapesPoints, []),
      []
    )

    expect(titreCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesDeleted.length).toEqual(0)
    expect(console.info).not.toHaveBeenCalled()
  })

  test("n'ajoute pas de commune si l'étape n'a pas de périmètre", async () => {
    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesUpdated = [],
      titresEtapesCommunesDeleted = []
    ] = await titresEtapesCommunesUpdate(
      titreEtapesAreasIndexGet(titresEtapesPointsVides, []),
      []
    )

    expect(titreCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesDeleted.length).toEqual(0)
    expect(console.info).not.toHaveBeenCalled()
  })

  test("n'ajoute pas de commune si l'étape n'a pas de la propriété `points`", async () => {
    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesUpdated = [],
      titresEtapesCommunesDeleted = []
    ] = await titresEtapesCommunesUpdate(
      titreEtapesAreasIndexGet(titresEtapesSansPoints, []),
      []
    )

    expect(titreCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesDeleted.length).toEqual(0)
    expect(console.info).not.toHaveBeenCalled()
  })

  test("n'ajoute pas de commune si elle existe déjà dans l'étape", async () => {
    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesUpdated = [],
      titresEtapesCommunesDeleted = []
    ] = await titresEtapesCommunesUpdate(
      titreEtapesAreasIndexGet(titresEtapesPointsCommuneExistante, [commune1]),
      [commune1]
    )

    expect(titreCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesDeleted.length).toEqual(0)
    expect(console.info).not.toHaveBeenCalled()
  })

  test("met à jour la commune dans l'étape si sa surface couverte a changé", async () => {
    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesUpdated = [],
      titresEtapesCommunesDeleted = []
    ] = await titresEtapesCommunesUpdate(
      titreEtapesAreasIndexGet(titresEtapesPointsCommuneExistante, [
        commune1SurfaceChangee
      ]),
      [commune1]
    )

    expect(titreCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesUpdated.length).toEqual(1)
    expect(titresEtapesCommunesDeleted.length).toEqual(0)
    expect(console.info).toHaveBeenCalled()
  })

  test("supprime une commune si l'étape ne la contient plus dans son périmètre", async () => {
    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesUpdated = [],
      titresEtapesCommunesDeleted = []
    ] = await titresEtapesCommunesUpdate(
      titreEtapesAreasIndexGet(titresEtapesPointsCommuneInexistante, []),
      []
    )

    expect(titreCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesDeleted.length).toEqual(1)
    expect(console.info).toHaveBeenCalled()
  })
})

describe('mise à jour de toutes les territoires des étapes', () => {
  test("met à jour la commune dans l'étape si sa surface couverte a changé", async () => {
    apiCommunesMocked.mockResolvedValue({ communes: [commune1SurfaceChangee] })

    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesUpdated = [],
      titresEtapesCommunesDeleted = []
    ] = await titresEtapesAreasUpdate(
      [titresEtapesPointsCommuneExistante],
      [commune1]
    )

    expect(titreCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesUpdated.length).toEqual(1)
    expect(titresEtapesCommunesDeleted.length).toEqual(0)
    expect(console.info).toHaveBeenCalled()
  })

  test("retourne un message d'erreur si l'API Géo communes ne répond pas", async () => {
    apiCommunesMocked.mockResolvedValue(null)

    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesUpdated = [],
      titresEtapesCommunesDeleted = []
    ] = await titresEtapesAreasUpdate([titresEtapesPointsVides], [])

    expect(titreCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesDeleted.length).toEqual(0)
    expect(apiCommunesMocked).toHaveBeenCalled()
    expect(console.info).not.toHaveBeenCalled()
    expect(console.warn).toHaveBeenCalled()
  })
})
