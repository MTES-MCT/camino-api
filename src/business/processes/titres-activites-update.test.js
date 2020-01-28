import titresActivitesTypesUpdate from './titres-activites-update'

import * as titreActiviteTypeFilter from '../utils/titre-activite-filter'
import * as titreActivitesQueries from '../../database/queries/titres-activites'
import * as titreActivitesBuild from '../rules/titre-activites-build'

import {
  titresSansActivite,
  titresToutesActivites
} from './__mocks__/titres-activites-update-titres'

jest.mock('../utils/titre-activite-filter', () => ({
  default: jest.fn()
}))

jest.mock('../../database/queries/titres-activites', () => ({
  titreActivitesUpsert: jest.fn().mockResolvedValue()
}))

jest.mock('../rules/titre-activites-build', () => ({
  default: jest.fn().mockResolvedValue()
}))

console.log = jest.fn()

describe("activités d'un titre", () => {
  test('met à jour un titre sans activité', async () => {
    titreActiviteTypeFilter.default.mockImplementation(() => true)
    titreActivitesBuild.default.mockImplementation(() => [1])

    const titresActivitesNew = await titresActivitesTypesUpdate(
      titresSansActivite,
      []
    )

    expect(titresActivitesNew.length).toEqual(1)

    expect(titreActiviteTypeFilter.default).toHaveBeenCalled()
    expect(titreActivitesQueries.titreActivitesUpsert).toHaveBeenCalled()
    expect(titreActivitesBuild.default).toHaveBeenCalled()
    expect(console.log).toHaveBeenCalled()
  })

  test('ne met pas à jour un titre possédant déjà des activités', async () => {
    titreActiviteTypeFilter.default.mockImplementation(() => true)
    titreActivitesBuild.default.mockImplementation(() => [])

    const titresActivitesNew = await titresActivitesTypesUpdate(
      titresToutesActivites,
      []
    )

    expect(titresActivitesNew.length).toEqual(0)

    expect(titreActiviteTypeFilter.default).toHaveBeenCalled()
    expect(titreActivitesBuild.default).toHaveBeenCalled()
    expect(titreActivitesQueries.titreActivitesUpsert).not.toHaveBeenCalled()
    expect(console.log).not.toHaveBeenCalled()
  })

  test("ne met pas à jour un titre ne correspondant à aucun type d'activité", async () => {
    titreActiviteTypeFilter.default.mockImplementation(() => false)

    const titresActivitesNew = await titresActivitesTypesUpdate(
      titresSansActivite,
      []
    )

    expect(titresActivitesNew.length).toEqual(0)

    expect(titreActiviteTypeFilter.default).toHaveBeenCalledTimes(1)
    expect(titreActivitesBuild.default).not.toHaveBeenCalled()
    expect(titreActivitesQueries.titreActivitesUpsert).not.toHaveBeenCalled()
    expect(console.log).not.toHaveBeenCalled()
  })
})
