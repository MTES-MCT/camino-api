import { titreStatutIdUpdate, titrePropUpdate, titreIdsUpdate } from './titres'
import * as titresQueries from '../../database/queries/titres'

import { titreValide, titreOldId, titreNew } from './__mocks__/titres-titres'

// `jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../../database/queries/titres', () => ({
  titreUpdate: jest.fn().mockImplementation(() => Promise.resolve()),
  titreIdUpdate: jest.fn().mockImplementation(() => Promise.resolve())
}))

beforeAll(() => {
  jest
    .spyOn(titresQueries, 'titreUpdate')
    .mockImplementation((titre, prop) => Promise.resolve())
})

afterAll(() => {
  jest.restoreAllMocks()
})

describe("met à jour le statut d'un titre", () => {
  test('un titre dont le statut a changé est mis à jour', async () => {
    titreStatutIdUpdate(titreValide, 'ech')
    expect(titresQueries.titreUpdate).toHaveBeenCalled()
  })

  test("un titre dont le statut est inchangé n'est pas mis à jour", async () => {
    titreStatutIdUpdate(titreValide, 'val')
    expect(titresQueries.titreUpdate).not.toHaveBeenCalled()
  })
})

describe("met à jour la propriété calculée d'un titre", () => {
  test("un titre avec une propriété dont l'étape est différente est mis à jour", async () => {
    titrePropUpdate(
      titreValide,
      'pointsEtapeId',
      'm-prx-saint-pierre-2014-oct01-dpu02'
    )
    expect(titresQueries.titreUpdate).toHaveBeenCalled()
  })

  test("un titre avec une propriété dont l'étape est la même n'est pas mis à jour", async () => {
    titrePropUpdate(
      titreValide,
      'substancesTitreEtapeId',
      'm-prx-saint-pierre-2014-oct01-dpu01'
    )
    expect(titresQueries.titreUpdate).not.toHaveBeenCalled()
  })

  test('un titre avec une propriété date est pas mis à jour', async () => {
    titrePropUpdate(titreValide, 'dateDebut', '2008-12-12T23:00:00.000Z')
    expect(titresQueries.titreUpdate).toHaveBeenCalled()
  })
})

describe('met à jour le titre et ses dépendances', () => {
  test('le titre et ses dépendances sont mis à jour', async () => {
    titreIdsUpdate(titreOldId, titreNew)
    expect(titresQueries.titreIdUpdate).toHaveBeenCalled()
  })
})
