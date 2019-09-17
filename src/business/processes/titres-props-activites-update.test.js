import titresPropsActivitesUpdate from './titres-props-activites-update'
import titrePropActivitesCount from '../utils/titre-prop-activites-count'

jest.mock('../../database/queries/titres', () => ({
  titreUpdate: jest.fn()
}))

jest.mock('../utils/titre-prop-activites-count', () => ({
  default: jest.fn()
}))

console.log = jest.fn()

describe('titre propriétés-activités', () => {
  test('met à jour 3 propriétés activités', async () => {
    titrePropActivitesCount.mockImplementation(() => 3)

    const titresPropsActivitesUpdated = await titresPropsActivitesUpdate([{}])

    expect(titresPropsActivitesUpdated.length).toEqual(1)
    expect(console.log).toHaveBeenCalled()
  })

  test('ne trouve pas de propriétés activités à mettre à jour', async () => {
    titrePropActivitesCount.mockImplementation(() => null)

    const titresPropsActivitesUpdated = await titresPropsActivitesUpdate([
      {
        activitesAbsentes: null,
        activitesEnConstruction: null,
        activitesDeposees: null
      }
    ])

    expect(titresPropsActivitesUpdated.length).toEqual(0)
  })
})
