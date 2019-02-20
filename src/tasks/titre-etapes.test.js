import {
  titreEtapesOrdreUpdate,
  titreEtapeCommunesInsert,
  titreEtapeCommunesDelete
} from './titre-etapes'
import * as titreEtapesQueries from '../database/queries/titres-etapes'

import {
  titreEtapesByDemarche,
  titreEtapesByDemarcheEgales,
  titreEtapesByDemarcheOrdonnees,
  titreEtapeCommunesParis,
  titreEtapeCommunesMetz
} from './__mocks__/titre-etapes-etapes'

// `jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../database/queries/titres-etapes', () => ({
  titreEtapeUpdate: jest.fn().mockImplementation(() => Promise.resolve()),
  titreEtapeCommuneInsert: jest
    .fn()
    .mockImplementation(() => Promise.resolve()),
  titreEtapeCommuneDelete: jest.fn().mockImplementation(() => Promise.resolve())
}))

console.log = jest.fn()

describe("met à jour l'ordre des étapes d'une démarche", () => {
  test('deux étapes sont mises à jour', async () => {
    titreEtapesOrdreUpdate(titreEtapesByDemarche)
    expect(titreEtapesQueries.titreEtapeUpdate).toHaveBeenCalledTimes(2)
  })

  test('les étapes dont les dates sont les mêmes sont mises à jour', async () => {
    titreEtapesOrdreUpdate(titreEtapesByDemarcheEgales)
    expect(titreEtapesQueries.titreEtapeUpdate).toHaveBeenCalled()
  })

  test("les étapes dont l'ordre est correct ne sont pas mises à jour", async () => {
    titreEtapesOrdreUpdate(titreEtapesByDemarcheOrdonnees)
    expect(titreEtapesQueries.titreEtapeUpdate).not.toHaveBeenCalled()
  })
})

describe('ajoute des communes à une étape', () => {
  test("une nouvelle commune est ajoutée à l'étape", async () => {
    titreEtapeCommunesInsert(titreEtapeCommunesParis, ['Metz'])
    expect(titreEtapesQueries.titreEtapeCommuneInsert).toHaveBeenCalled()
  })

  test("la commune déjà présente dans l'étape qui n'est pas mise à jour", async () => {
    titreEtapeCommunesInsert(titreEtapeCommunesMetz, ['Metz'])
    expect(titreEtapesQueries.titreEtapeCommuneInsert).not.toHaveBeenCalled()
  })
})

describe('supprime des communes à une étape', () => {
  test("une commune est supprimée de l'étape", async () => {
    titreEtapeCommunesDelete(titreEtapeCommunesMetz, ['Paris'])
    expect(titreEtapesQueries.titreEtapeCommuneDelete).toHaveBeenCalled()
  })

  test("la commune n'existe pas dans l'étape qui n'est pas mise à jour", async () => {
    titreEtapeCommunesDelete(titreEtapeCommunesParis, ['Paris'])
    expect(titreEtapesQueries.titreEtapeCommuneDelete).not.toHaveBeenCalled()
  })

  test("l'étape n'a pas de communes", async () => {
    titreEtapeCommunesDelete({}, ['Paris'])
    expect(titreEtapesQueries.titreEtapeCommuneDelete).not.toHaveBeenCalled()
  })
})
