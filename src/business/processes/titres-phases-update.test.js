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
    const titresPhasesUpdated = await titresPhasesUpdate(titresUnePhase)

    expect(titresPhasesUpdated.length).toEqual(1)

    expect(queries.titrePhasesUpdate).toHaveBeenCalledWith(titrePhase)
    expect(console.log).toHaveBeenCalled()
  })

  test('met à jour un titre dont une phase est modifiée', async () => {
    const titresPhasesUpdated = await titresPhasesUpdate(
      titresUnePhaseMiseAJour
    )

    expect(titresPhasesUpdated.length).toEqual(1)

    expect(queries.titrePhasesUpdate).toHaveBeenCalledWith(titrePhase)
    expect(console.log).toHaveBeenCalled()
  })

  test('met à jour un titre dont une phase est supprimée', async () => {
    const titresPhasesUpdated = await titresPhasesUpdate(titresPhaseASupprimer)

    expect(titresPhasesUpdated.length).toEqual(1)

    expect(queries.titrePhasesDelete).toHaveBeenCalledWith([
      'h-cxx-courdemanges-1988-oct01'
    ])
    expect(console.log).toHaveBeenCalled()
  })

  test("ne met pas à jour un titre si aucune phase n'est modifiée", async () => {
    const titresPhasesUpdated = await titresPhasesUpdate(
      titresUnePhaseSansChangement
    )

    expect(titresPhasesUpdated.length).toEqual(0)

    expect(queries.titrePhasesDelete).not.toHaveBeenCalled()
    expect(queries.titrePhasesUpdate).not.toHaveBeenCalled()
    expect(console.log).not.toHaveBeenCalled()
  })

  test("ne met pas à jour un titre si aucune phase n'existe", async () => {
    const titresPhasesUpdated = await titresPhasesUpdate(titresSansPhase)

    expect(titresPhasesUpdated.length).toEqual(0)

    expect(queries.titrePhasesDelete).not.toHaveBeenCalled()
    expect(queries.titrePhasesUpdate).not.toHaveBeenCalled()
    expect(console.log).not.toHaveBeenCalled()
  })
})
