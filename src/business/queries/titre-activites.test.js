import { titreActivitesUpsert } from './titre-activites'
import * as titreActivitesQueries from '../../database/queries/titres-activites'

// `jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../../database/queries/titres-activites', () => ({
  titreActivitesUpsert: jest.fn().mockResolvedValue()
}))

describe("activités d'un titre", () => {
  test('crée une activité', async () => {
    const log = await titreActivitesUpsert([{ id: 1 }])

    expect(log).toMatch(/Création/)
    expect(titreActivitesQueries.titreActivitesUpsert).toHaveBeenCalled()
  })
})
