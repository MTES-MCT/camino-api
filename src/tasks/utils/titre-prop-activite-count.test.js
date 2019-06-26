import titrePropActivitesCount from './titre-prop-activites-count'

import { titreActivites } from '../rules/__mocks__/titre-prop-activites-count-activites'

describe('décompte des activités (dé-normalise)', () => {
  test('compte les activités', () => {
    expect(titrePropActivitesCount(titreActivites, 'dep')).toEqual(3)
  })

  test("retourne null si il n'y a aucune activité", () => {
    expect(titrePropActivitesCount(titreActivites, 'enc')).toBeNull()
  })
})
