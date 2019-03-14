import titresActivitesTypesUpdate from './titres-activites-update'

import '../../database/format'
import * as titreActivitesTypesFilter from '../utils/titre-activites-filter'
import * as titreActivitesQueries from '../queries/titre-activites'

import {
  titresSansActivite,
  titresToutesActivites
} from './__mocks__/titres-activites-update-titres'

// `jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../../database/format', () => ({
  titreFormat: e => e
}))

jest.mock('../utils/titre-activites-filter', () => ({
  default: () => [{}]
}))

jest.mock('../queries/titre-activites', () => ({
  titreActiviteTypeUpdate: jest
    .fn()
    .mockImplementation(titre =>
      [...new Array(4 - titre.activites.length)].map(() => Promise.resolve())
    )
}))

console.log = jest.fn()

describe("crée les activités manquantes d'un titre", () => {
  test("un titre ne correspondant à aucun type d'activité n'est pas mis à jour", async () => {
    const filterSpy = jest
      .spyOn(titreActivitesTypesFilter, 'default')
      .mockImplementation(() => [])
    const updateSpy = jest.spyOn(
      titreActivitesQueries,
      'titreActiviteTypeUpdate'
    )

    expect(
      await titresActivitesTypesUpdate(titresSansActivite, [], [])
    ).toEqual('Mise à jour: 0 activités.')

    expect(filterSpy).toHaveBeenCalledTimes(1)
    expect(updateSpy).toHaveBeenCalledTimes(0)
    expect(console.log).toHaveBeenCalledTimes(0)

    filterSpy.mockRestore()
  })

  test('un titre sans activité est mis à jour', async () => {
    const filterSpy = jest.spyOn(titreActivitesTypesFilter, 'default')
    const updateSpy = jest.spyOn(
      titreActivitesQueries,
      'titreActiviteTypeUpdate'
    )

    expect(
      await titresActivitesTypesUpdate(titresSansActivite, [], [])
    ).toEqual('Mise à jour: 4 activités.')

    expect(filterSpy).toHaveBeenCalledTimes(1)
    expect(updateSpy).toHaveBeenCalledTimes(1)
    expect(console.log).toHaveBeenCalledTimes(4)
  })

  test("un titre avec activité n'est pas mis à jour", async () => {
    const filterSpy = jest.spyOn(titreActivitesTypesFilter, 'default')
    const updateSpy = jest.spyOn(
      titreActivitesQueries,
      'titreActiviteTypeUpdate'
    )

    expect(
      await titresActivitesTypesUpdate(titresToutesActivites, [], [])
    ).toEqual('Mise à jour: 0 activités.')

    expect(filterSpy).toHaveBeenCalledTimes(1)
    expect(updateSpy).toHaveBeenCalledTimes(1)
    expect(console.log).toHaveBeenCalledTimes(0)
  })
})
