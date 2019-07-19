import titresPropsActivitesUpdate from './titres-props-activites-update'
import titrePropActivitesCount from '../utils/titre-prop-activites-count'

// `jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../queries/titres', () => ({
  titrePropsUpdate: jest.fn()
}))

jest.mock('../utils/titre-prop-activites-count', () => ({
  default: jest.fn()
}))

console.log = jest.fn()

describe("propriétés (activités) d'un titre", () => {
  test('met à jour 3 propriétés activités', async () => {
    titrePropActivitesCount.mockImplementation(() => 3)
    const titresPropsActivitesUpdatelog = await titresPropsActivitesUpdate([{}])

    expect(titresPropsActivitesUpdatelog).toEqual(
      'Mise à jour: propriétés (activités) de 1 titre(s).'
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
      'Mise à jour: propriétés (activités) de 0 titre(s).'
    )
  })
})
