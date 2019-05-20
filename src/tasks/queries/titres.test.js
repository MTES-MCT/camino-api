import { titreStatutIdUpdate, titrePropsUpdate, titreIdUpdate } from './titres'
import * as titresQueries from '../../database/queries/titres'

import {
  titreValide,
  titreOldId,
  titreOld,
  titreNew
} from './__mocks__/titres-titres'

// `jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../../database/queries/titres', () => ({
  titrePropsUpdate: jest.fn().mockImplementation(() => Promise.resolve()),
  titreIdUpdate: jest.fn().mockImplementation(() => Promise.resolve())
}))

beforeAll(() => {
  jest
    .spyOn(titresQueries, 'titrePropsUpdate')
    .mockImplementation((titre, prop) => Promise.resolve())
})

afterAll(() => {
  jest.restoreAllMocks()
})

describe("met à jour le statut d'un titre", () => {
  test('un titre dont le statut a changé est mis à jour', async () => {
    titreStatutIdUpdate(titreValide, 'ech')
    expect(titresQueries.titrePropsUpdate).toHaveBeenCalled()
  })

  test("un titre dont le statut est inchangé n'est pas mis à jour", async () => {
    titreStatutIdUpdate(titreValide, 'val')
    expect(titresQueries.titrePropsUpdate).not.toHaveBeenCalled()
  })
})

describe("met à jour la propriété calculée d'un titre", () => {
  test("un titre avec une propriété dont l'étape est différente est mis à jour", async () => {
    titrePropsUpdate(titreValide, 'points')
    expect(titresQueries.titrePropsUpdate).toHaveBeenCalled()
  })

  test("un titre avec une propriété dont l'étape est la même n'est pas mis à jour", async () => {
    titrePropsUpdate(titreValide, 'substances')
    expect(titresQueries.titrePropsUpdate).not.toHaveBeenCalled()
  })
})

describe("met à jour l'id d'un titre", () => {
  test("un titre dont l'id a changé est mis à jour", async () => {
    titreIdUpdate(titreOldId, titreNew)
    expect(titresQueries.titreIdUpdate).toHaveBeenCalled()
  })

  test("un titre dont l'id est inchangé n'est pas mis à jour", async () => {
    titreIdUpdate(titreOldId, titreOld)
    expect(titresQueries.titreIdUpdate).not.toHaveBeenCalled()
  })
})
