import { titreActiviteTypeUpdate } from './titre-activites'
import * as titreActivitesQueries from '../../database/queries/titres-activites'
import * as titreActiviteCreate from '../rules/titre-activite-create'

import {
  titreVide,
  titreAvecActivites,
  activiteTypeTrimestre,
  activiteTypeMois
} from './__mocks__/titre-activites-activites'

// `jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../../database/queries/titres-activites', () => ({
  titreActiviteInsert: jest.fn().mockImplementation(() => Promise.resolve())
}))

jest.mock('../rules/titre-activite-create', () => ({
  default: jest.fn().mockImplementation(() => true)
}))

describe('ajoute des nouvelles activités à un titre', () => {
  test("quatre activités sont ajoutées pour un type d'activité trimestriel", async () => {
    expect(
      (await Promise.all(
        titreActiviteTypeUpdate(titreVide, activiteTypeTrimestre, [2018])
      ))[0]
    ).toMatch(/Création/)
    expect(titreActivitesQueries.titreActiviteInsert).toHaveBeenCalledTimes(4)
  })

  test("douze activités sont ajoutées pour un type d'activité mensuel", async () => {
    expect(
      (await Promise.all(
        titreActiviteTypeUpdate(titreAvecActivites, activiteTypeMois, [2018])
      ))[0]
    ).toMatch(/Création/)
    expect(titreActivitesQueries.titreActiviteInsert).toHaveBeenCalledTimes(12)
  })

  test("aucune activité n'est ajoutée si le titre ne correspond pas aux critères de l'activité", async () => {
    jest.spyOn(titreActiviteCreate, 'default').mockImplementation(() => false)

    expect(
      await Promise.all(
        titreActiviteTypeUpdate(titreAvecActivites, activiteTypeMois, [2018])
      )
    ).toEqual([])
    expect(titreActivitesQueries.titreActiviteInsert).not.toHaveBeenCalled()
  })
})
