const titresQueries = {
  titrePropsUpdate: jest.fn().mockImplementation(() => Promise.resolve())
}

jest.mock('../database/queries/titres', () => titresQueries)

import { titreStatutIdUpdate, titrePropsUpdate } from './titres'

import { titreValide } from './__mocks__/titres-titres'

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
