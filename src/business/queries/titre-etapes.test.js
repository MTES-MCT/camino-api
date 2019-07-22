import {
  titreEtapeUpdate,
  titreEtapeCommunesInsert,
  titreEtapeCommunesDelete,
  titreEtapeAdministrationsInsert,
  titreEtapeAdministrationsDelete
} from './titre-etapes'
import * as titreEtapesQueries from '../../database/queries/titres-etapes'

import {
  titreEtapeCommunesParis,
  titreEtapeCommunesMetz,
  titreEtapeAdministrationsPrefectureParis,
  titreEtapeAdministrationsPrefectureMetz
} from './__mocks__/titre-etapes-etapes'

// `jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../../database/queries/titres-etapes', () => ({
  titreEtapeUpdate: jest.fn().mockResolvedValue(),
  titreEtapeCommuneInsert: jest.fn().mockResolvedValue(),
  titreEtapeCommuneDelete: jest.fn().mockResolvedValue(),
  titreEtapeAdministrationInsert: jest.fn().mockResolvedValue(),
  titreEtapeAdministrationDelete: jest.fn().mockResolvedValue()
}))

describe("propriétés d'une étape", () => {
  test("met à jour des propriétés d'étape", async () => {
    const log = await titreEtapeUpdate('', {})
    expect(log).toMatch(/Mise à jour/)
    expect(titreEtapesQueries.titreEtapeUpdate).toHaveBeenCalled()
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

describe('ajoute des administrations à une étape', () => {
  test("une nouvelle administration est ajoutée à l'étape", async () => {
    titreEtapeAdministrationsInsert(titreEtapeAdministrationsPrefectureParis, [
      'prefecture-metz'
    ])
    expect(titreEtapesQueries.titreEtapeAdministrationInsert).toHaveBeenCalled()
  })

  test("l'administration déjà présente dans l'étape qui n'est pas mise à jour", async () => {
    titreEtapeAdministrationsInsert(titreEtapeAdministrationsPrefectureMetz, [
      'prefecture-metz'
    ])
    expect(
      titreEtapesQueries.titreEtapeAdministrationInsert
    ).not.toHaveBeenCalled()
  })
})

describe('supprime des administrations à une étape', () => {
  test("une administration est supprimée de l'étape", async () => {
    titreEtapeAdministrationsDelete(titreEtapeAdministrationsPrefectureMetz, [
      'prefecture-paris'
    ])
    expect(titreEtapesQueries.titreEtapeAdministrationDelete).toHaveBeenCalled()
  })

  test("l'administration n'existe pas dans l'étape qui n'est pas mise à jour", async () => {
    titreEtapeAdministrationsDelete(titreEtapeAdministrationsPrefectureParis, [
      'prefecture-paris'
    ])
    expect(
      titreEtapesQueries.titreEtapeAdministrationDelete
    ).not.toHaveBeenCalled()
  })

  test("l'étape n'a pas d'administration", async () => {
    titreEtapeAdministrationsDelete({}, ['prefecture-paris'])
    expect(
      titreEtapesQueries.titreEtapeAdministrationDelete
    ).not.toHaveBeenCalled()
  })
})
