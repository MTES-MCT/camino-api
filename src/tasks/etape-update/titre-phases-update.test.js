const titrePhasesQueries = {
  titrePhaseUpdate: (titrePhase, titresPhasesOld) => Promise.resolve(),
  titrePhaseDelete: (titresPhasesOld, titrePhases) => Promise.resolve()
}

jest.mock('../titre-phases', () => titrePhasesQueries)

import titrePhasesUpdate from './titre-phases-update'
import {
  titreSansPhase,
  titreUnePhase,
  titreDeuxPhases,
  titrePhaseASupprimer,
  titreUnePhaseSansChangement
} from './__mocks__/titre-phases-update-titres'

describe("met à jour les phase d'un titre", () => {
  test('un titre avec une phase est mis à jour', async () => {
    expect(await titrePhasesUpdate(titreUnePhase)).toEqual(
      'Mise à jour: 1 phases de titres.'
    )
  })

  test('un titre avec deux phases est mis à jour', async () => {
    expect(await titrePhasesUpdate(titreDeuxPhases)).toEqual(
      'Mise à jour: 2 phases de titres.'
    )
  })

  test("un titre sans phase n'est pas mis à jour", async () => {
    expect(await titrePhasesUpdate(titreSansPhase)).toEqual(
      'Mise à jour: 0 phases de titres.'
    )
  })

  test("un titre dont une phase n'existe plus est mis à jour", async () => {
    expect(await titrePhasesUpdate(titrePhaseASupprimer)).toEqual(
      'Mise à jour: 1 phases de titres.'
    )
  })

  test("un titre dont une phase n'a pas changé n'est pas mis à jour", async () => {
    titrePhasesQueries.titrePhaseUpdate = jest
      .fn()
      .mockImplementation(() => null)
    titrePhasesQueries.titrePhaseDelete = jest
      .fn()
      .mockImplementation(() => null)

    expect(await titrePhasesUpdate(titreUnePhaseSansChangement)).toEqual(
      'Mise à jour: 0 phases de titres.'
    )
  })
})
