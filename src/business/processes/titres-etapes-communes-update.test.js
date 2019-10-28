import titresEtapeCommunesUpdate from './titres-etapes-communes-update'
import * as apiCommunes from '../../tools/api-communes/index'

import {
  titresEtapesPoints,
  titresEtapesPointsVides,
  titresEtapesPointsMemeCommune,
  titresEtapesPointsCommuneInexistante,
  titresEtapesPointsCommuneExistante
} from './__mocks__/titres-etapes-communes-update-etapes'

jest.mock('../../database/queries/territoires', () => ({
  communesUpsert: jest.fn().mockImplementation(a => a)
}))

jest.mock('../../database/queries/titres-etapes', () => ({
  titresEtapesCommunesCreate: jest.fn().mockImplementation(a => a),
  titreEtapeCommuneDelete: jest.fn().mockImplementation(a => a)
}))

jest.mock('../../tools/geojson', () => ({
  geojsonFeatureMultiPolygon: points => ({
    geometry: { coordinates: [points] }
  })
}))

jest.mock('../../tools/api-communes/index', () => ({
  default: jest.fn()
}))

console.log = jest.fn()

describe("communes et communes d'étapes", () => {
  test('ajoute 2 communes dans une étape et dans la liste de communes', async () => {
    apiCommunes.default.mockResolvedValue([{ id: 1 }, { id: 2 }])

    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesCreated = [],
      titresEtapesCommunesDeleted = []
    ] = await titresEtapeCommunesUpdate(titresEtapesPoints, [])

    expect(titreCommunesUpdated.length).toEqual(2)
    expect(titresEtapesCommunesCreated.length).toEqual(2)
    expect(titresEtapesCommunesDeleted.length).toEqual(0)
    expect(console.log).toHaveBeenCalledTimes(2)
  })

  test("n'ajoute qu'une seule fois une commune en doublon", async () => {
    apiCommunes.default.mockResolvedValue([{ id: 1 }])

    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesCreated = [],
      titresEtapesCommunesDeleted = []
    ] = await titresEtapeCommunesUpdate(titresEtapesPointsMemeCommune, [
      { id: 0 }
    ])

    expect(titreCommunesUpdated.length).toEqual(1)
    expect(titresEtapesCommunesCreated.length).toEqual(1)
    expect(titresEtapesCommunesDeleted.length).toEqual(0)
    expect(console.log).toHaveBeenCalledTimes(2)
  })

  test("n'ajoute aucune commune dans l'étape ni dans la liste de communes", async () => {
    apiCommunes.default.mockResolvedValue([])

    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesCreated = [],
      titresEtapesCommunesDeleted = []
    ] = await titresEtapeCommunesUpdate(titresEtapesPoints, [])

    expect(titreCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesCreated.length).toEqual(0)
    expect(titresEtapesCommunesDeleted.length).toEqual(0)
    expect(console.log).not.toHaveBeenCalled()
  })

  test("n'ajoute pas de commune si l'étape n'a pas de périmètre", async () => {
    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesCreated = [],
      titresEtapesCommunesDeleted = []
    ] = await titresEtapeCommunesUpdate(titresEtapesPointsVides, [])
    apiCommunes.default.mockResolvedValue([])

    expect(titreCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesCreated.length).toEqual(0)
    expect(titresEtapesCommunesDeleted.length).toEqual(0)
    expect(console.log).not.toHaveBeenCalled()
  })

  test("n'ajoute pas de commune si elle existe déjà dans l'étape", async () => {
    apiCommunes.default.mockResolvedValue([{ id: 1 }])

    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesCreated = [],
      titresEtapesCommunesDeleted = []
    ] = await titresEtapeCommunesUpdate(titresEtapesPointsCommuneExistante, [
      { id: 1 }
    ])

    expect(titreCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesCreated.length).toEqual(0)
    expect(titresEtapesCommunesDeleted.length).toEqual(0)
    expect(console.log).not.toHaveBeenCalled()
  })

  test("supprime une commune si l'étape ne la contient plus dans son périmètre", async () => {
    apiCommunes.default.mockResolvedValue([{ id: 1 }])

    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesCreated = [],
      titresEtapesCommunesDeleted = []
    ] = await titresEtapeCommunesUpdate(titresEtapesPointsCommuneInexistante, [
      { id: 0 }
    ])

    expect(titreCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesCreated.length).toEqual(0)
    expect(titresEtapesCommunesDeleted.length).toEqual(1)
    expect(console.log).toHaveBeenCalled()
  })

  test("retourne un message d'erreur si l'API Géo communes ne répond pas", async () => {
    apiCommunes.default.mockResolvedValue()

    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesCreated = [],
      titresEtapesCommunesDeleted = []
    ] = await titresEtapeCommunesUpdate(titresEtapesPointsVides, [])

    expect(titreCommunesUpdated.length).toEqual(0)
    expect(titresEtapesCommunesCreated.length).toEqual(0)
    expect(titresEtapesCommunesDeleted.length).toEqual(0)
    expect(apiCommunes.default).toHaveBeenCalled()
    expect(console.log).not.toHaveBeenCalled()
  })
})
