import titresPhasesUpdate from './titres-phases-update'
import * as titresPhasesQueries from '../queries/titre-phases'

import {
  titresSansPhase,
  titresUnePhase,
  titresDeuxPhases,
  titresPhaseASupprimer,
  titresUnePhaseSansChangement
} from './__mocks__/titres-phases-update-titres'

// `jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../queries/titre-phases', () => ({
  titrePhaseUpdate: (titrePhase, titresPhasesOld) => Promise.resolve(),
  titrePhaseDelete: (titresPhasesOld, titresPhases) => Promise.resolve()
}))

console.log = jest.fn()

describe("met à jour les phases d'un titre", () => {
  test('un titre avec une phase est mis à jour', async () => {
    expect(await titresPhasesUpdate(titresUnePhase)).toEqual(
      'Mise à jour: 1 phases de titres.'
    )
    expect(console.log).toHaveBeenCalled()
  })

  test('un titre avec deux phases est mis à jour', async () => {
    expect(await titresPhasesUpdate(titresDeuxPhases)).toEqual(
      'Mise à jour: 2 phases de titres.'
    )
    expect(console.log).toHaveBeenCalledTimes(2)
  })

  test("un titre sans phase n'est pas mis à jour", async () => {
    expect(await titresPhasesUpdate(titresSansPhase)).toEqual(
      'Mise à jour: 0 phases de titres.'
    )
    expect(console.log).not.toHaveBeenCalled()
  })

  test("un titre dont une phase n'existe plus est mis à jour", async () => {
    expect(await titresPhasesUpdate(titresPhaseASupprimer)).toEqual(
      'Mise à jour: 1 phases de titres.'
    )
    expect(console.log).toHaveBeenCalled()
  })

  test("un titre dont une phase n'a pas changé n'est pas mis à jour", async () => {
    titresPhasesQueries.titrePhaseUpdate = jest
      .fn()
      .mockImplementation(() => null)
    titresPhasesQueries.titrePhaseDelete = jest
      .fn()
      .mockImplementation(() => null)

    expect(await titresPhasesUpdate(titresUnePhaseSansChangement)).toEqual(
      'Mise à jour: 0 phases de titres.'
    )
    expect(console.log).not.toHaveBeenCalled()
  })
})
