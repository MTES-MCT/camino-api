import titreActiviteCreate from './titre-activite-create'
import * as titreValiditePeriodeCheck from '../utils/titre-validite-periode-check'

import {
  titreVide,
  titreModificationEnInstance,
  titreAvecActivite201801,
  activiteTypeXxx,
  activiteTypeGrp
} from './__mocks__/titre-activite-create-titres'

// `jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../../database/queries/titres-activites', () => ({
  titreActiviteInsert: jest.fn().mockImplementation(() => Promise.resolve())
}))

jest.mock('../utils/titre-validite-periode-check', () => ({
  default: jest.fn().mockImplementation(() => true)
}))

describe("construit une activité à partir d'une période", () => {
  test("une activité n'est pas créée pour un titre qui la possède déjà", () => {
    expect(
      titreActiviteCreate(titreAvecActivite201801, activiteTypeGrp.id, 2018, 0)
    ).toBeNull()

    expect(titreValiditePeriodeCheck.default).not.toHaveBeenCalled()
  })

  test('une activité est créée pour un titre qui ne la possède pas déjà', () => {
    expect(
      titreActiviteCreate(titreAvecActivite201801, activiteTypeXxx.id, 2018, 0)
    ).not.toBeNull()

    expect(titreValiditePeriodeCheck.default).toHaveBeenCalled()
  })

  test("une activité n'est pas créée si le titre n'est pas valide pour la période", () => {
    jest
      .spyOn(titreValiditePeriodeCheck, 'default')
      .mockImplementation(() => false)

    expect(titreActiviteCreate(titreVide, activiteTypeGrp, 2018, 3)).toBeNull()
    expect(titreValiditePeriodeCheck.default).toHaveBeenCalledTimes(1)
  })

  test("une activité est créée si le titre a le statut 'modification en instance'", () => {
    jest
      .spyOn(titreValiditePeriodeCheck, 'default')
      .mockImplementation(() => false)

    expect(
      titreActiviteCreate(titreModificationEnInstance, activiteTypeGrp, 2018, 3)
    ).not.toBeNull()
    expect(titreValiditePeriodeCheck.default).not.toHaveBeenCalled()
  })
})
