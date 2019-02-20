import { titrePhaseUpdate, titrePhaseDelete } from './titre-phases'
import * as titrePhasesQueries from '../database/queries/titres-phases'

import {
  titrePhase,
  titrePhaseModifiee,
  titrePhases
} from './__mocks__/titre-phases-phases'

// `jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../database/queries/titres-phases', () => ({
  titrePhaseUpdate: jest.fn().mockImplementation(() => Promise.resolve()),
  titrePhaseDelete: jest.fn().mockImplementation(() => Promise.resolve())
}))

describe('ajoute ou met à jour une phase', () => {
  test("crée une phase qui n'existe pas", async () => {
    expect(await titrePhaseUpdate(titrePhase, [])).toMatch(/Création/)
    expect(titrePhasesQueries.titrePhaseUpdate).toHaveBeenCalledTimes(1)
  })

  test('met à jour une phase qui existe déjà dont une propriété a été changée', async () => {
    expect(await titrePhaseUpdate(titrePhaseModifiee, titrePhases)).toMatch(
      /Mise à jour/
    )
    expect(titrePhasesQueries.titrePhaseUpdate).toHaveBeenCalledTimes(1)
  })

  test("une phase qui n'a pas été modifiée n'est pas mise à jour", async () => {
    expect(await titrePhaseUpdate(titrePhase, titrePhases)).toBeFalsy()
    expect(titrePhasesQueries.titrePhaseUpdate).not.toHaveBeenCalled()
  })
})

describe('supprime une phase', () => {
  test("une phase qui n'existe plus est supprimée", async () => {
    expect(await titrePhaseDelete(titrePhase, [])).toMatch(/Suppression/)
    expect(titrePhasesQueries.titrePhaseDelete).toHaveBeenCalled()
  })

  test("une phrase qui existe toujours n'est pas supprimée", async () => {
    expect(await titrePhaseDelete(titrePhase, titrePhases)).toBeFalsy()
    expect(titrePhasesQueries.titrePhaseDelete).not.toHaveBeenCalled()
  })
})
