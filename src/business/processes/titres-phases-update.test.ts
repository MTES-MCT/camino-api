import { mocked } from 'ts-jest/utils'
import { titresPhasesUpdate } from './titres-phases-update'
import * as queries from '../../database/queries/titres-phases'
import { titresGet } from '../../database/queries/titres'

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

jest.mock('../../database/queries/titres', () => ({
  titresGet: jest.fn()
}))

const titresGetMock = mocked(titresGet, true)

console.info = jest.fn()

describe("phases d'un titre", () => {
  test('met à jour un titre dont une phase est créée', async () => {
    titresGetMock.mockResolvedValue(titresUnePhase)

    const [
      titresPhasesUpdated,
      titresPhasesDeleted
    ] = await titresPhasesUpdate()

    expect(titresPhasesUpdated.length).toEqual(1)
    expect(titresPhasesDeleted.length).toEqual(0)

    expect(queries.titrePhasesUpsert).toHaveBeenCalledWith(titrePhase)
  })

  test('met à jour un titre dont une phase est modifiée', async () => {
    titresGetMock.mockResolvedValue(titresUnePhaseMiseAJour)
    const [
      titresPhasesUpdated,
      titresPhasesDeleted
    ] = await titresPhasesUpdate()

    expect(titresPhasesUpdated.length).toEqual(1)
    expect(titresPhasesDeleted.length).toEqual(0)

    expect(queries.titrePhasesUpsert).toHaveBeenCalledWith(titrePhase)
  })

  test('met à jour un titre dont une phase est supprimée', async () => {
    titresGetMock.mockResolvedValue(titresPhaseASupprimer)
    const [
      titresPhasesUpdated,
      titresPhasesDeleted
    ] = await titresPhasesUpdate()

    expect(titresPhasesUpdated.length).toEqual(0)
    expect(titresPhasesDeleted.length).toEqual(1)

    expect(queries.titrePhasesDelete).toHaveBeenCalledWith([
      'h-cx-courdemanges-1988-oct01'
    ])
  })

  test("ne met pas à jour un titre si aucune phase n'est modifiée", async () => {
    titresGetMock.mockResolvedValue(titresUnePhaseSansChangement)
    const [
      titresPhasesUpdated,
      titresPhasesDeleted
    ] = await titresPhasesUpdate()

    expect(titresPhasesUpdated.length).toEqual(0)
    expect(titresPhasesDeleted.length).toEqual(0)

    expect(queries.titrePhasesDelete).not.toHaveBeenCalled()
    expect(queries.titrePhasesUpsert).not.toHaveBeenCalled()
  })

  test("ne met pas à jour un titre si aucune phase n'existe", async () => {
    titresGetMock.mockResolvedValue(titresSansPhase)
    const [
      titresPhasesUpdated,
      titresPhasesDeleted
    ] = await titresPhasesUpdate()

    expect(titresPhasesUpdated.length).toEqual(0)
    expect(titresPhasesDeleted.length).toEqual(0)

    expect(queries.titrePhasesDelete).not.toHaveBeenCalled()
    expect(queries.titrePhasesUpsert).not.toHaveBeenCalled()
  })
})
