import titresActivitesTypesUpdate from './titres-activites-update'

import * as titreActivitesTypesFilter from '../utils/titre-activites-filter'
import * as titreActivitesQueries from '../../database/queries/titres-activites'
import * as titreActivitesExport from '../../tools/export/titre-activites'
import * as titreActivitesBuild from '../rules/titre-activites-build'

import {
  titresSansActivite,
  titresToutesActivites
} from './__mocks__/titres-activites-update-titres'

jest.mock('../utils/titre-activites-filter', () => ({
  default: jest.fn()
}))

jest.mock('../../database/queries/titres-activites', () => ({
  titreActivitesUpsert: jest.fn().mockResolvedValue()
}))

jest.mock('../../tools/export/titre-activites', () => ({
  titreActivitesRowUpdate: jest.fn().mockResolvedValue()
}))

jest.mock('../rules/titre-activites-build', () => ({
  default: jest.fn().mockResolvedValue()
}))

console.log = jest.fn()

describe("activités d'un titre", () => {
  test('met à jour un titre sans activité', async () => {
    titreActivitesTypesFilter.default.mockImplementation(() => [1])
    titreActivitesBuild.default.mockImplementation(() => [1])

    const titresActivitesNew = await titresActivitesTypesUpdate(
      titresSansActivite,
      [],
      []
    )

    expect(titresActivitesNew.length).toEqual(1)

    expect(titreActivitesTypesFilter.default).toHaveBeenCalled()
    expect(titreActivitesQueries.titreActivitesUpsert).toHaveBeenCalled()
    expect(titreActivitesExport.titreActivitesRowUpdate).toHaveBeenCalled()
    expect(titreActivitesBuild.default).toHaveBeenCalled()
    expect(console.log).toHaveBeenCalled()
  })

  test('ne met pas à jour un titre possédant déjà des activités', async () => {
    titreActivitesTypesFilter.default.mockImplementation(() => [1])
    titreActivitesBuild.default.mockImplementation(() => [])

    const titresActivitesNew = await titresActivitesTypesUpdate(
      titresToutesActivites,
      [],
      []
    )

    expect(titresActivitesNew.length).toEqual(0)

    expect(titreActivitesTypesFilter.default).toHaveBeenCalled()
    expect(titreActivitesBuild.default).toHaveBeenCalled()
    expect(titreActivitesQueries.titreActivitesUpsert).not.toHaveBeenCalled()
    expect(titreActivitesExport.titreActivitesRowUpdate).not.toHaveBeenCalled()
    expect(console.log).not.toHaveBeenCalled()
  })

  test("ne met pas à jour un titre ne correspondant à aucun type d'activité", async () => {
    titreActivitesTypesFilter.default.mockImplementation(() => [])

    const titresActivitesNew = await titresActivitesTypesUpdate(
      titresSansActivite,
      [],
      []
    )

    expect(titresActivitesNew.length).toEqual(0)

    expect(titreActivitesTypesFilter.default).toHaveBeenCalledTimes(1)
    expect(titreActivitesBuild.default).not.toHaveBeenCalled()
    expect(titreActivitesQueries.titreActivitesUpsert).not.toHaveBeenCalled()
    expect(titreActivitesExport.titreActivitesRowUpdate).not.toHaveBeenCalled()
    expect(console.log).not.toHaveBeenCalled()
  })
})
