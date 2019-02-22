import titresEtapeCommunesUpdate from './titres-etapes-communes-update'

import * as communes from '../queries/communes'
import * as titreEtapes from '../queries/titre-etapes'
import * as geojson from '../../tools/geojson'
import * as apiCommunes from '../../tools/api-communes'

import {
  titresEtapesPoints,
  titresEtapesPointsVides,
  titresEtapesPointsMemeCommune
} from './__mocks__/titres-etapes-communes-update-etapes'

// `jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../queries/communes', () => ({
  communesInsert: communes => communes.map(commune => Promise.resolve(commune))
}))

jest.mock('../queries/titre-etapes', () => ({
  titreEtapeCommunesInsert: () => [],
  titreEtapeCommunesDelete: () => []
}))

jest.mock('../../tools/geojson', () => ({
  geojsonFeatureMultiPolygon: points => ({ geometry: { coordinates: points } })
}))

jest.mock('../../tools/api-communes', () => ({
  default: geojson =>
    Promise.resolve(
      geojson.geometry.coordinates.map(p => ({ properties: { code: p } }))
    )
}))

console.log = jest.fn()

describe('met à jour la liste globale des communes et la liste de communes pour une étape', () => {
  test('ajoute 2 communes dans une étape et dans la liste de communes', async () => {
    const insertSpy = jest
      .spyOn(titreEtapes, 'titreEtapeCommunesInsert')
      .mockImplementation(titreEtape =>
        titreEtape.points.map(p => Promise.resolve(p))
      )

    expect(await titresEtapeCommunesUpdate(titresEtapesPoints, [])).toEqual([
      'Mise à jour: 2 communes dans la base.',
      'Mise à jour: 2 communes dans des étapes.'
    ])

    expect(insertSpy).toHaveBeenCalledTimes(1)
    expect(console.log).toHaveBeenCalledTimes(4)

    insertSpy.mockRestore()
  })

  test("une commune en doublon n'est pas ajoutée deux fois", async () => {
    const insertSpy = jest
      .spyOn(titreEtapes, 'titreEtapeCommunesInsert')
      .mockImplementation(titreEtape => [Promise.resolve()])
    const deleteSpy = jest
      .spyOn(titreEtapes, 'titreEtapeCommunesDelete')
      .mockImplementation(titreEtape => [])

    expect(
      await titresEtapeCommunesUpdate(titresEtapesPointsMemeCommune, [
        { id: 1 }
      ])
    ).toEqual([
      'Mise à jour: 1 communes dans la base.',
      'Mise à jour: 1 communes dans des étapes.'
    ])

    expect(insertSpy).toHaveBeenCalledTimes(1)
    expect(deleteSpy).toHaveBeenCalledTimes(1)
    expect(console.log).toHaveBeenCalledTimes(2)

    insertSpy.mockRestore()
    deleteSpy.mockRestore()
  })

  test("n'ajoute aucune commune dans l'étape ni dans la liste de communes", async () => {
    apiCommunes.default = () => []

    expect(await titresEtapeCommunesUpdate(titresEtapesPoints, [])).toEqual([
      'Mise à jour: 0 communes dans la base.',
      'Mise à jour: 0 communes dans des étapes.'
    ])

    expect(console.log).not.toHaveBeenCalled()
  })

  test("l'étape n'a pas de périmètre", async () => {
    expect(await titresEtapeCommunesUpdate(titresEtapesPointsVides)).toEqual([
      'Mise à jour: 0 communes dans la base.',
      'Mise à jour: 0 communes dans des étapes.'
    ])

    expect(console.log).not.toHaveBeenCalled()
  })

  test("l'API Géo communes ne répond pas", async () => {
    apiCommunes.default = jest.fn()

    expect(await titresEtapeCommunesUpdate(titresEtapesPointsVides)).toEqual([
      "Erreur: impossible de se connecter à l'API Géo communes",
      'Mise à jour: 0 communes dans la base.',
      'Mise à jour: 0 communes dans des étapes.'
    ])

    expect(apiCommunes.default).toHaveBeenCalled()
    expect(console.log).not.toHaveBeenCalled()
  })
})
