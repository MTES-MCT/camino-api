import titresActivitesTypesUpdate from './titres-activites-update'

import titreActiviteTypeFilter from '../utils/titre-activite-filter'
import titreActiviteTypeAnneesFind from '../utils/titre-activite-type-annees-find'
import { titreActivitesUpsert } from '../../database/queries/titres-activites'
import titreActivitesBuild from '../rules/titre-activites-build'

import {
  titresSansActivite,
  titresToutesActivites,
  titreActivitesTypes
} from './__mocks__/titres-activites-update-titres'

jest.mock('../utils/titre-activite-filter', () => ({
  __esModule: true,
  default: jest.fn()
}))

jest.mock('../utils/titre-activite-type-annees-find', () => ({
  __esModule: true,
  default: jest.fn()
}))

jest.mock('../../database/queries/titres-activites', () => ({
  __esModule: true,
  titreActivitesUpsert: jest.fn().mockResolvedValue()
}))

jest.mock('../rules/titre-activites-build', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue()
}))

console.log = jest.fn()

describe("activités d'un titre", () => {
  test('met à jour un titre sans activité', async () => {
    titreActiviteTypeFilter.mockImplementation(() => true)
    titreActiviteTypeAnneesFind.mockImplementation(() => [2018])
    titreActivitesBuild.mockImplementation(() => [1])

    const titresActivitesNew = await titresActivitesTypesUpdate(
      titresSansActivite,
      titreActivitesTypes
    )

    expect(titresActivitesNew.length).toEqual(1)

    expect(titreActiviteTypeFilter).toHaveBeenCalledTimes(
      titresSansActivite.length
    )
    expect(titreActivitesUpsert).toHaveBeenCalled()
    expect(titreActivitesBuild).toHaveBeenCalled()
    expect(console.log).toHaveBeenCalled()
  })

  test('ne met pas à jour un titre possédant déjà des activités', async () => {
    titreActiviteTypeFilter.mockImplementation(() => true)
    titreActiviteTypeAnneesFind.mockImplementation(() => [2018])
    titreActivitesBuild.mockImplementation(() => [])

    const titresActivitesNew = await titresActivitesTypesUpdate(
      titresToutesActivites,
      titreActivitesTypes
    )

    expect(titresActivitesNew.length).toEqual(0)

    expect(titreActiviteTypeFilter).toHaveBeenCalledTimes(1)
    expect(titreActivitesBuild).toHaveBeenCalled()
    expect(titreActivitesUpsert).not.toHaveBeenCalled()
    expect(console.log).not.toHaveBeenCalled()
  })

  test("ne met pas à jour un titre ne correspondant à aucun type d'activité", async () => {
    titreActiviteTypeFilter.mockImplementation(() => false)
    titreActiviteTypeAnneesFind.mockImplementation(() => [2018])

    const titresActivitesNew = await titresActivitesTypesUpdate(
      titresSansActivite,
      titreActivitesTypes
    )

    expect(titresActivitesNew.length).toEqual(0)

    expect(titreActiviteTypeFilter).toHaveBeenCalledTimes(1)
    expect(titreActivitesBuild).not.toHaveBeenCalled()
    expect(titreActivitesUpsert).not.toHaveBeenCalled()
    expect(console.log).not.toHaveBeenCalled()
  })

  test('ne met pas à jour de titre si les activités ne sont valables sur aucune année', async () => {
    titreActiviteTypeFilter.mockImplementation(() => false)
    titreActiviteTypeAnneesFind.mockImplementation(() => [])

    const titresActivitesNew = await titresActivitesTypesUpdate(
      titresSansActivite,
      titreActivitesTypes
    )

    expect(titresActivitesNew.length).toEqual(0)

    expect(titreActiviteTypeFilter).not.toHaveBeenCalled()
    expect(titreActivitesBuild).not.toHaveBeenCalled()
    expect(titreActivitesUpsert).not.toHaveBeenCalled()
    expect(console.log).not.toHaveBeenCalled()
  })
})
