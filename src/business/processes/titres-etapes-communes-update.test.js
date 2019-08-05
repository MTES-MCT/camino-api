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
  communesUpsert: jest.fn().mockResolvedValue()
}))

jest.mock('../../database/queries/titres-etapes', () => ({
  titresEtapesCommunesCreate: jest.fn().mockResolvedValue(),
  titreEtapeCommuneDelete: jest.fn().mockResolvedValue()
}))

jest.mock('../../tools/geojson', () => ({
  geojsonFeatureMultiPolygon: points => ({
    geometry: { coordinates: [...new Set(points)] }
  })
}))

jest.mock('../../tools/api-communes/index', () => ({
  default: jest.fn()
}))

console.log = jest.fn()

describe("communes et communes d'étapes", () => {
  test('ajoute 2 communes dans une étape et dans la liste de communes', async () => {
    apiCommunes.default.mockResolvedValue([{ id: 1 }, { id: 2 }])

    const log = await titresEtapeCommunesUpdate(titresEtapesPoints, [])

    expect(log).toEqual([
      'mise à jour: 2 commune(s)',
      'mise à jour: 2 commune(s) ajoutée(s) dans des étapes',
      'mise à jour: 0 commune(s) supprimée(s) dans des étapes'
    ])
    expect(console.log).toHaveBeenCalledTimes(2)
  })

  test("n'ajoute qu'une seule fois une commune en doublon", async () => {
    apiCommunes.default.mockResolvedValue([{ id: 1 }])

    const log = await titresEtapeCommunesUpdate(titresEtapesPointsMemeCommune, [
      { id: 0 }
    ])

    expect(log).toEqual([
      'mise à jour: 1 commune(s)',
      'mise à jour: 1 commune(s) ajoutée(s) dans des étapes',
      'mise à jour: 0 commune(s) supprimée(s) dans des étapes'
    ])
    expect(console.log).toHaveBeenCalledTimes(2)
  })

  test("n'ajoute aucune commune dans l'étape ni dans la liste de communes", async () => {
    apiCommunes.default.mockResolvedValue([])

    const log = await titresEtapeCommunesUpdate(titresEtapesPoints, [])

    expect(log).toEqual([
      'mise à jour: 0 commune(s)',
      'mise à jour: 0 commune(s) ajoutée(s) dans des étapes',
      'mise à jour: 0 commune(s) supprimée(s) dans des étapes'
    ])
    expect(console.log).not.toHaveBeenCalled()
  })

  test("n'ajoute pas de commune si l'étape n'a pas de périmètre", async () => {
    const log = await titresEtapeCommunesUpdate(titresEtapesPointsVides, [])
    apiCommunes.default.mockResolvedValue([])

    expect(log).toEqual([
      'mise à jour: 0 commune(s)',
      'mise à jour: 0 commune(s) ajoutée(s) dans des étapes',
      'mise à jour: 0 commune(s) supprimée(s) dans des étapes'
    ])
    expect(console.log).not.toHaveBeenCalled()
  })

  test("n'ajoute pas de commune si elle existe déjà dans l'étape", async () => {
    apiCommunes.default.mockResolvedValue([{ id: 1 }])

    const log = await titresEtapeCommunesUpdate(
      titresEtapesPointsCommuneExistante,
      [{ id: 1 }]
    )

    expect(log).toEqual([
      'mise à jour: 0 commune(s)',
      'mise à jour: 0 commune(s) ajoutée(s) dans des étapes',
      'mise à jour: 0 commune(s) supprimée(s) dans des étapes'
    ])
    expect(console.log).not.toHaveBeenCalled()
  })

  test("supprime une commune si l'étape ne la contient plus dans son périmètre", async () => {
    apiCommunes.default.mockResolvedValue([{ id: 1 }])

    const log = await titresEtapeCommunesUpdate(
      titresEtapesPointsCommuneInexistante,
      [{ id: 0 }]
    )

    expect(log).toEqual([
      'mise à jour: 0 commune(s)',
      'mise à jour: 0 commune(s) ajoutée(s) dans des étapes',
      'mise à jour: 1 commune(s) supprimée(s) dans des étapes'
    ])
    expect(console.log).toHaveBeenCalled()
  })

  test("retourne un message d'erreur si l'API Géo communes ne répond pas", async () => {
    apiCommunes.default.mockResolvedValue()

    const log = await titresEtapeCommunesUpdate(titresEtapesPointsVides, [])

    expect(log).toEqual([
      "erreur: impossible de se connecter à l'API Géo communes",
      'mise à jour: 0 commune(s)',
      'mise à jour: 0 commune(s) ajoutée(s) dans des étapes',
      'mise à jour: 0 commune(s) supprimée(s) dans des étapes'
    ])
    expect(apiCommunes.default).toHaveBeenCalled()
    expect(console.log).not.toHaveBeenCalled()
  })
})
