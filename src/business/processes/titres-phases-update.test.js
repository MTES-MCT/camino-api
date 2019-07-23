import titresPhasesUpdate from './titres-phases-update'

import {
  titresSansPhase,
  titresUnePhase,
  titresPhaseASupprimer,
  titresUnePhaseSansChangement,
  titresUnePhaseMiseAJour
} from './__mocks__/titres-phases-update-titres'

// `jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../../database/queries/titres-phases', () => ({
  titrePhasesUpdate: jest.fn().mockResolvedValue(),
  titrePhasesDelete: jest.fn().mockResolvedValue()
}))

console.log = jest.fn()

describe("phases d'un titre", () => {
  test('met à jour un titre dont une phase est créée', async () => {
    expect(await titresPhasesUpdate(titresUnePhase)).toEqual(
      'Mise à jour: 1 titre(s) (phases).'
    )
    expect(console.log).toHaveBeenCalled()
  })

  test('met à jour un titre dont une phase est modifiée', async () => {
    expect(await titresPhasesUpdate(titresUnePhaseMiseAJour)).toEqual(
      'Mise à jour: 1 titre(s) (phases).'
    )
    expect(console.log).toHaveBeenCalled()
  })

  test('met à jour un titre dont une phase est supprimée', async () => {
    expect(await titresPhasesUpdate(titresPhaseASupprimer)).toEqual(
      'Mise à jour: 1 titre(s) (phases).'
    )
    expect(console.log).toHaveBeenCalled()
  })

  test("ne met pas à jour un titre si aucune phase n'est modifiée", async () => {
    expect(await titresPhasesUpdate(titresUnePhaseSansChangement)).toEqual(
      'Mise à jour: 0 titre(s) (phases).'
    )
    expect(console.log).not.toHaveBeenCalled()
  })

  test("ne met pas à jour un titre si aucune phase n'existe", async () => {
    expect(await titresPhasesUpdate(titresSansPhase)).toEqual(
      'Mise à jour: 0 titre(s) (phases).'
    )
    expect(console.log).not.toHaveBeenCalled()
  })
})
