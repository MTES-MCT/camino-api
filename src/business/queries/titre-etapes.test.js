import {
  titreEtapeUpdate,
  titreEtapesCommunesCreate,
  titreEtapeCommuneDelete,
  titreEtapesAdministrationsCreate,
  titreEtapeAdministrationDelete
} from './titre-etapes'
import * as titreEtapesQueries from '../../database/queries/titres-etapes'

import {
  titreEtapeAdministrationsPrefectureParis,
  titreEtapeAdministrationsPrefectureMetz
} from './__mocks__/titre-etapes-etapes'

// `jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../../database/queries/titres-etapes', () => ({
  titreEtapeUpdate: jest.fn().mockResolvedValue(),
  titreEtapesCommunesCreate: jest.fn().mockResolvedValue(),
  titreEtapeCommuneDelete: jest.fn().mockResolvedValue(),
  titreEtapesAdministrationsCreate: jest.fn().mockResolvedValue(),
  titreEtapeAdministrationDelete: jest.fn().mockResolvedValue()
}))

describe('queries étape (à supprimer)', () => {
  test("met à jour des propriétés d'étape", async () => {
    const log = await titreEtapeUpdate('', {})

    expect(log).toMatch(/Mise à jour/)
    expect(titreEtapesQueries.titreEtapeUpdate).toHaveBeenCalled()
  })

  test("ajoute une nouvelle commune à l'étape", async () => {
    const log = await titreEtapesCommunesCreate([
      {
        titreEtapeId: 'id-etape',
        communeId: 'Paris'
      }
    ])

    expect(log).toMatch(/Mise à jour/)
    expect(titreEtapesQueries.titreEtapesCommunesCreate).toHaveBeenCalled()
  })

  test("supprime une commune de l'étape", async () => {
    const log = await titreEtapeCommuneDelete({
      titreEtapeId: 'id-etape',
      communeId: 'Paris'
    })

    expect(log).toMatch(/Suppression/)
    expect(titreEtapesQueries.titreEtapeCommuneDelete).toHaveBeenCalled()
  })
})

describe('ajoute des administrations à une étape', () => {
  test("une nouvelle administration est ajoutée à l'étape", async () => {
    titreEtapesAdministrationsCreate(titreEtapeAdministrationsPrefectureParis, [
      'prefecture-metz'
    ])
    expect(
      titreEtapesQueries.titreEtapesAdministrationsCreate
    ).toHaveBeenCalled()
  })

  test("l'administration déjà présente dans l'étape qui n'est pas mise à jour", async () => {
    titreEtapesAdministrationsCreate(titreEtapeAdministrationsPrefectureMetz, [
      'prefecture-metz'
    ])
    expect(
      titreEtapesQueries.titreEtapesAdministrationsCreate
    ).not.toHaveBeenCalled()
  })
})

describe('supprime des administrations à une étape', () => {
  test("une administration est supprimée de l'étape", async () => {
    titreEtapeAdministrationDelete(titreEtapeAdministrationsPrefectureMetz, [
      'prefecture-paris'
    ])
    expect(titreEtapesQueries.titreEtapeAdministrationDelete).toHaveBeenCalled()
  })

  test("l'administration n'existe pas dans l'étape qui n'est pas mise à jour", async () => {
    titreEtapeAdministrationDelete(titreEtapeAdministrationsPrefectureParis, [
      'prefecture-paris'
    ])
    expect(
      titreEtapesQueries.titreEtapeAdministrationDelete
    ).not.toHaveBeenCalled()
  })

  test("l'étape n'a pas d'administration", async () => {
    titreEtapeAdministrationDelete({}, ['prefecture-paris'])
    expect(
      titreEtapesQueries.titreEtapeAdministrationDelete
    ).not.toHaveBeenCalled()
  })
})
