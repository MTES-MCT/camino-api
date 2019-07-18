import {
  titreDemarcheStatutIdUpdate,
  titreDemarchesOrdreUpdate
} from './titre-demarches'

import * as titreDemarchesQueries from '../../database/queries/titres-demarches'

import {
  titreDemarches,
  titreDemarchesOrdonnees
} from './__mocks__/titre-demarches-demarches'

// `jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../../database/queries/titres-demarches', () => ({
  titreDemarcheUpdate: jest.fn().mockImplementation(() => Promise.resolve())
}))

describe("statut de démarche d'un titre", () => {
  test("met à jour le statut d'un titre dont le statut d'une démarche a changé", async () => {
    titreDemarcheStatutIdUpdate(titreDemarches[0], 'rej')
    expect(titreDemarchesQueries.titreDemarcheUpdate).toHaveBeenCalled()
  })

  test('ne met pas à jour un titre dont le statut de la démarche est inchangé', async () => {
    titreDemarcheStatutIdUpdate(titreDemarches[0], 'acc')
    expect(titreDemarchesQueries.titreDemarcheUpdate).not.toHaveBeenCalled()
  })
})

describe("ordre des démarches d'un titre", () => {
  test("met à jour un titre dont une propriété d'étape a changé", async () => {
    titreDemarchesOrdreUpdate(titreDemarches)
    expect(titreDemarchesQueries.titreDemarcheUpdate).toHaveBeenCalled()
  })

  test("ne met pas à jour un titre dont une propriété d'étape est inchangée", async () => {
    titreDemarchesOrdreUpdate(titreDemarchesOrdonnees)
    expect(titreDemarchesQueries.titreDemarcheUpdate).not.toHaveBeenCalled()
  })
})
