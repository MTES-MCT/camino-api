import { mocked } from 'ts-jest/utils'
import { titresActivitesStatutIdsUpdate } from './titres-activites-statut-ids-update'
import { titresActivitesGet } from '../../database/queries/titres-activites'

import {
  titresActivitesDelaiDepasse,
  titresActivitesDelaiNonDepasse
} from './__mocks__/titres-activites-statut-ids-update-activites'

jest.mock('../../database/queries/titres-activites', () => ({
  titreActiviteUpdate: jest.fn().mockResolvedValue(true),
  titresActivitesGet: jest.fn()
}))

const titresActivitesGetMock = mocked(titresActivitesGet, true)

console.info = jest.fn()

describe("statut des activités d'un titre", () => {
  test("met à jour le statut d'une activité", async () => {
    titresActivitesGetMock.mockResolvedValue(titresActivitesDelaiDepasse)
    const titresActivites = await titresActivitesStatutIdsUpdate()

    expect(titresActivites.length).toEqual(1)
  })

  test("ne met pas à jour le statut d'une activité", async () => {
    titresActivitesGetMock.mockResolvedValue(titresActivitesDelaiNonDepasse)
    const titresActivites = await titresActivitesStatutIdsUpdate()

    expect(titresActivites.length).toEqual(0)
  })
})
