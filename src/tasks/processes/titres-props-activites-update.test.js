import titresPropsActivitesUpdate from './titres-props-activites-update'
import { titrePropUpdate } from '../queries/titres'

// `jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../queries/titres', () => ({
  titrePropUpdate: jest.fn()
}))

jest.mock('../utils/titre-prop-activites-count', () => ({
  default: () => ''
}))

console.log = jest.fn()

describe("propriétés (activités) d'un titre", () => {
  test('met à jour 3 propriétés activités', async () => {
    titrePropUpdate.mockImplementation(() => Promise.resolve('Mise à jour…'))
    const titresPropsActivitesUpdatelog = await titresPropsActivitesUpdate([{}])

    expect(titresPropsActivitesUpdatelog).toEqual(
      'Mise à jour: 3 propriétés (activités) de titres.'
    )
    expect(console.log).toHaveBeenCalled()
  })

  test('ne trouve pas de propriétés activités à mettre à jour', async () => {
    titrePropUpdate.mockImplementation(() => false)
    const titresPropsActivitesUpdatelog = await titresPropsActivitesUpdate([{}])

    expect(titresPropsActivitesUpdatelog).toEqual(
      'Mise à jour: 0 propriétés (activités) de titres.'
    )
  })
})
