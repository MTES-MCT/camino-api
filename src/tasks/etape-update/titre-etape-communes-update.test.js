const communes = {}
const titreEtapes = {}
const geojson = {}
const apiCommunes = {}

jest.mock('../communes', () => ({
  communesInsert: points => points
}))

jest.mock('../titre-etapes', () => ({
  titreEtapeCommunesInsert: (titreEtape, communes) => communes,
  titreEtapeCommunesDelete: (titreEtape, communes) => communes
}))

jest.mock('../../tools/geojson', () => ({
  geojsonFeatureMultiPolygon: points => points
}))

jest.mock('../../tools/api-communes', () => ({
  default: points =>
    apiCommunes.get
      ? apiCommunes.get(points).map(() => ({ properties: {} }))
      : []
}))

import titreEtapeCommunesUpdate from './titre-etape-communes-update'
import {
  titreEtapePoints,
  titreEtapePointsVides
} from './__mocks__/titre-etape-communes-update-etapes'

describe('met à jour la liste globale des communes et la liste de communes pour une étape', () => {
  test('ajoute 2 communes dans une étape et dans la liste de communes', async () => {
    apiCommunes.get = () => [1, 2]

    expect(await titreEtapeCommunesUpdate(titreEtapePoints, [])).toEqual([
      'Mise à jour: 2 communes dans la base.',
      'Mise à jour: 2 communes dans des étapes.'
    ])

    delete apiCommunes.get
  })

  test("n'ajoute aucune commune dans l'étape ni dans la liste de communes", async () => {
    expect(await titreEtapeCommunesUpdate(titreEtapePoints, [])).toEqual([])
  })

  test("l'étape n'a pas de périmètre", async () => {
    expect(await titreEtapeCommunesUpdate(titreEtapePointsVides)).toEqual([])
  })
})
