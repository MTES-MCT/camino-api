import titresPropsActivitesUpdate from './titres-props-activites-update'
import titrePropActivitesCount from '../utils/titre-prop-activites-count'

// `jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
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
    const titresPropsActivitesUpdatelog = await titresPropsActivitesUpdate([{}])

    expect(titresPropsActivitesUpdatelog).toEqual(
      'mise à jour: 1 titre(s) (propriétés-activités)'
    )
    expect(console.log).toHaveBeenCalled()
  })

  test('ne trouve pas de propriétés activités à mettre à jour', async () => {
    titrePropActivitesCount.mockImplementation(() => null)
    const titresPropsActivitesUpdatelog = await titresPropsActivitesUpdate([
      {
        activitesAbsentes: null,
        activitesEnConstruction: null,
        activitesDeposees: null
      }
    ])

    expect(titresPropsActivitesUpdatelog).toEqual(
      'mise à jour: 0 titre(s) (propriétés-activités)'
    )
  })
})
