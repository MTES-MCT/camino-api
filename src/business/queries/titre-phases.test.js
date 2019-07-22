import { titrePhasesUpdate, titrePhasesDelete } from './titre-phases'
import * as titrePhasesQueries from '../../database/queries/titres-phases'

// `jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../../database/queries/titres-phases', () => ({
  titrePhasesUpdate: jest.fn().mockResolvedValue(),
  titrePhasesDelete: jest.fn().mockResolvedValue()
}))

describe('ajoute ou met à jour une phase', () => {
  test("crée une phase qui n'existe pas", async () => {
    expect(await titrePhasesUpdate([{ id: 'id1' }])).toMatch(/Mise à jour/)
    expect(titrePhasesQueries.titrePhasesUpdate).toHaveBeenCalledTimes(1)
  })

  test('supprime une phase', async () => {
    expect(await titrePhasesDelete(['id1', 'id2'])).toMatch(/Suppression/)
    expect(titrePhasesQueries.titrePhasesDelete).toHaveBeenCalled()
  })
})
