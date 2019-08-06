import titresPhasesUpdate from './titres-phases-update'
import * as queries from '../../database/queries/titres-phases'

import {
  titresSansPhase,
  titresUnePhase,
  titresPhaseASupprimer,
  titresUnePhaseSansChangement,
  titresUnePhaseMiseAJour,
  titrePhase
} from './__mocks__/titres-phases-update-titres'

jest.mock('../../database/queries/titres-phases', () => ({
  titrePhasesUpdate: jest.fn().mockResolvedValue(),
  titrePhasesDelete: jest.fn().mockResolvedValue()
}))

console.log = jest.fn()

describe("phases d'un titre", () => {
  test('met à jour un titre dont une phase est créée', async () => {
    expect(await titresPhasesUpdate(titresUnePhase)).toEqual(
      'mise à jour: 1 titre(s) (phases)'
    )

    expect(queries.titrePhasesUpdate).toHaveBeenCalledWith(titrePhase)
    expect(console.log).toHaveBeenCalled()
  })

  test('met à jour un titre dont une phase est modifiée', async () => {
    expect(await titresPhasesUpdate(titresUnePhaseMiseAJour)).toEqual(
      'mise à jour: 1 titre(s) (phases)'
    )

    expect(queries.titrePhasesUpdate).toHaveBeenCalledWith(titrePhase)
    expect(console.log).toHaveBeenCalled()
  })

  test('met à jour un titre dont une phase est supprimée', async () => {
    expect(await titresPhasesUpdate(titresPhaseASupprimer)).toEqual(
      'mise à jour: 1 titre(s) (phases)'
    )

    expect(queries.titrePhasesDelete).toHaveBeenCalledWith([
      'h-cxx-courdemanges-1988-oct01'
    ])
    expect(console.log).toHaveBeenCalled()
  })

  test("ne met pas à jour un titre si aucune phase n'est modifiée", async () => {
    expect(await titresPhasesUpdate(titresUnePhaseSansChangement)).toEqual(
      'mise à jour: 0 titre(s) (phases)'
    )

    expect(queries.titrePhasesDelete).not.toHaveBeenCalled()
    expect(queries.titrePhasesUpdate).not.toHaveBeenCalled()
    expect(console.log).not.toHaveBeenCalled()
  })

  test("ne met pas à jour un titre si aucune phase n'existe", async () => {
    expect(await titresPhasesUpdate(titresSansPhase)).toEqual(
      'mise à jour: 0 titre(s) (phases)'
    )

    expect(queries.titrePhasesDelete).not.toHaveBeenCalled()
    expect(queries.titrePhasesUpdate).not.toHaveBeenCalled()
    expect(console.log).not.toHaveBeenCalled()
  })
})
