import { mocked } from 'ts-jest/utils'
import { titresActivitesPropsUpdate } from './titres-activites-props-update'
import { titresActivitesUpsert } from '../../database/queries/titres-activites'
import { titresGet } from '../../database/queries/titres'
import { titreValideCheck } from '../utils/titre-valide-check'

import {
  titresActivitesToUpdate,
  titresActivitesNotToUpdate
} from './__mocks__/titre-activite-props-update'

jest.mock('../../database/queries/titres-activites', () => ({
  titresActivitesUpsert: jest.fn()
}))

jest.mock('../../database/queries/titres', () => ({
  titresGet: jest.fn()
}))

jest.mock('../utils/titre-valide-check', () => ({
  titreValideCheck: jest.fn()
}))

const titresActivitesUpsertMock = mocked(titresActivitesUpsert, true)
const titresGetMock = mocked(titresGet, true)
const titreValideCheckMock = mocked(titreValideCheck, true)

console.info = jest.fn()

describe("propriété des activités d'un titre", () => {
  test("met à jour la propriété suppression d'une activité", async () => {
    titresGetMock.mockResolvedValue(titresActivitesToUpdate)
    titreValideCheckMock.mockReturnValueOnce(false)
    titreValideCheckMock.mockReturnValueOnce(false)
    titreValideCheckMock.mockReturnValueOnce(true)
    titreValideCheckMock.mockReturnValueOnce(true)
    const titresActivitesUpdated = await titresActivitesPropsUpdate()

    expect(titresActivitesUpdated).toEqual([
      'titre-activite-id-2019-04',
      'titre-activite-id-2020-01'
    ])
    expect(titresActivitesUpsertMock).toHaveBeenCalled()
  })
  test("be met pas à jour la propriété suppression d'une activité", async () => {
    titresGetMock.mockResolvedValue(titresActivitesNotToUpdate)
    const titresActivitesUpdated = await titresActivitesPropsUpdate()

    expect(titresActivitesUpdated).toEqual([])
    expect(titresActivitesUpsertMock).not.toHaveBeenCalled()
  })
})
