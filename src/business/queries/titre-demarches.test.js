import { titreDemarcheUpdate } from './titre-demarches'

import * as titreDemarchesQueries from '../../database/queries/titres-demarches'

// `jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../../database/queries/titres-demarches', () => ({
  titreDemarcheUpdate: jest.fn().mockResolvedValue()
}))

describe("propriétés d'une démarche", () => {
  test('met à jour un titre dont une propriété de démarche a changé', async () => {
    const log = await titreDemarcheUpdate('id', { prop: 1 })
    expect(log).toMatch(/Mise à jour/)
    expect(titreDemarchesQueries.titreDemarcheUpdate).toHaveBeenCalled()
  })
})
