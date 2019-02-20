import {
  titreDemarcheStatutIdUpdate,
  titreDemarchesOrdreUpdate
} from './titre-demarches'
import * as titreDemarchesQueries from '../database/queries/titres-demarches'

import {
  titreDemarches,
  titreDemarchesOrdonnees
} from './__mocks__/titre-demarches-demarches'

// `jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../database/queries/titres-demarches', () => ({
  titreDemarcheStatutIdUpdate: jest
    .fn()
    .mockImplementation(() => Promise.resolve()),
  titreDemarcheOrdreUpdate: jest
    .fn()
    .mockImplementation(() => Promise.resolve())
}))

console.log = jest.fn()

describe("met à jour le statut d'une démarche", () => {
  test('un titre dont le statut a changé est mis à jour', async () => {
    titreDemarcheStatutIdUpdate(titreDemarches[0], 'rej')
    expect(titreDemarchesQueries.titreDemarcheStatutIdUpdate).toHaveBeenCalled()
  })

  test("un titre dont le statut est inchangé n'est pas mis à jour", async () => {
    titreDemarcheStatutIdUpdate(titreDemarches[0], 'acc')
    expect(
      titreDemarchesQueries.titreDemarcheStatutIdUpdate
    ).not.toHaveBeenCalled()
  })
})

describe("met à jour l'ordre des démarches d'un titre", () => {
  test("un titre avec une propriété dont l'étape est différente est mis à jour", async () => {
    titreDemarchesOrdreUpdate(titreDemarches)
    expect(titreDemarchesQueries.titreDemarcheOrdreUpdate).toHaveBeenCalled()
  })

  test("un titre avec une propriété dont l'étape est la même n'est pas mis à jour", async () => {
    titreDemarchesOrdreUpdate(titreDemarchesOrdonnees)
    expect(
      titreDemarchesQueries.titreDemarcheOrdreUpdate
    ).not.toHaveBeenCalled()
  })
})
