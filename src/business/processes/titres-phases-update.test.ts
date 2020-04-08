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
  titrePhasesUpsert: jest.fn().mockResolvedValue(true),
  titrePhasesDelete: jest.fn().mockResolvedValue(true)
}))

console.info = jest.fn()

describe("phases d'un titre", () => {
  test('met à jour un titre dont une phase est créée', async () => {
    const [titresPhasesUpdated, titresPhasesDeleted] = await titresPhasesUpdate(
      titresUnePhase
    )

    expect(titresPhasesUpdated.length).toEqual(1)
    expect(titresPhasesDeleted.length).toEqual(0)

    expect(queries.titrePhasesUpsert).toHaveBeenCalledWith(titrePhase)
    expect(console.info).toHaveBeenCalled()
  })

  test('met à jour un titre dont une phase est modifiée', async () => {
    const [titresPhasesUpdated, titresPhasesDeleted] = await titresPhasesUpdate(
      titresUnePhaseMiseAJour
    )

    expect(titresPhasesUpdated.length).toEqual(1)
    expect(titresPhasesDeleted.length).toEqual(0)

    expect(queries.titrePhasesUpsert).toHaveBeenCalledWith(titrePhase)
    expect(console.info).toHaveBeenCalled()
  })

  test('met à jour un titre dont une phase est supprimée', async () => {
    const [titresPhasesUpdated, titresPhasesDeleted] = await titresPhasesUpdate(
      titresPhaseASupprimer
    )

    expect(titresPhasesUpdated.length).toEqual(0)
    expect(titresPhasesDeleted.length).toEqual(1)

    expect(queries.titrePhasesDelete).toHaveBeenCalledWith([
      'h-cx-courdemanges-1988-oct01'
    ])
    expect(console.info).toHaveBeenCalled()
  })

  test("ne met pas à jour un titre si aucune phase n'est modifiée", async () => {
    const [titresPhasesUpdated, titresPhasesDeleted] = await titresPhasesUpdate(
      titresUnePhaseSansChangement
    )

    expect(titresPhasesUpdated.length).toEqual(0)
    expect(titresPhasesDeleted.length).toEqual(0)

    expect(queries.titrePhasesDelete).not.toHaveBeenCalled()
    expect(queries.titrePhasesUpsert).not.toHaveBeenCalled()
    expect(console.info).not.toHaveBeenCalled()
  })

  test("ne met pas à jour un titre si aucune phase n'existe", async () => {
    const [titresPhasesUpdated, titresPhasesDeleted] = await titresPhasesUpdate(
      titresSansPhase
    )

    expect(titresPhasesUpdated.length).toEqual(0)
    expect(titresPhasesDeleted.length).toEqual(0)

    expect(queries.titrePhasesDelete).not.toHaveBeenCalled()
    expect(queries.titrePhasesUpsert).not.toHaveBeenCalled()
    expect(console.info).not.toHaveBeenCalled()
  })
})
