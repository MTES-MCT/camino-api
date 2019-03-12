import { titreActiviteTypeUpdate } from './titre-activites'
import * as titreActivitesQueries from '../../database/queries/titres-activites'
import * as titreValiditePeriodeCheck from '../utils/titre-validite-periode-check'

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

jest.mock('../utils/titre-validite-periode-check', () => ({
  default: jest.fn().mockImplementation(() => true)
}))

describe('ajoute des nouvelles activités à un titre', () => {
  test("de nouvelles activités sont ajoutés à un titre qui n'en contient pas", async () => {
    expect(
      (await Promise.all(
        titreActiviteTypeUpdate(titreVide, activiteTypeTrimestre, [2018, 2019])
      ))[0]
    ).toMatch(/Création/)
    expect(titreActivitesQueries.titreActiviteInsert).toHaveBeenCalledTimes(8)
  })

  test("aucune activité n'est ajoutée pour un titre qui en contient déjà", async () => {
    expect(
      await Promise.all(
        titreActiviteTypeUpdate(titreAvecActivites, activiteTypeMois, [2018])
      )
    ).toEqual([])
    expect(titreActivitesQueries.titreActiviteInsert).not.toHaveBeenCalled()
  })

  test("aucune activité n'est ajoutée pour un titre non valide", async () => {
    jest
      .spyOn(titreValiditePeriodeCheck, 'default')
      .mockImplementation(() => false)

    expect(
      await Promise.all(
        titreActiviteTypeUpdate(titreAvecActivites, activiteTypeMois, [2018])
      )
    ).toEqual([])
    expect(titreActivitesQueries.titreActiviteInsert).not.toHaveBeenCalled()
  })
})
