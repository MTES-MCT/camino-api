import titresActivitesStatutIdsUpdate from './titres-activites-statut-ids-update'

import {
  titresActivitesDelaiDepasse,
  titresActivitesDelaiNonDepasse
} from './__mocks__/titres-activites-statut-ids-update-activites'

jest.mock('../../database/queries/titres-activites', () => ({
  titreActiviteUpdate: jest.fn().mockResolvedValue(true)
}))

console.info = jest.fn()

describe("statut des activités d'un titre", () => {
  test("met à jour le statut d'une activité", async () => {
    const titresActivites = await titresActivitesStatutIdsUpdate(
      titresActivitesDelaiDepasse
    )

    expect(titresActivites.length).toEqual(1)
    expect(console.info).toHaveBeenCalled()
  })

  test("ne met pas à jour le statut d'une activité", async () => {
    const titresActivites = await titresActivitesStatutIdsUpdate(
      titresActivitesDelaiNonDepasse
    )

    expect(titresActivites.length).toEqual(0)
    expect(console.info).not.toHaveBeenCalled()
  })
})
