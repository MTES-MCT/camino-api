import titresPropsEtapeIdUpdate from './titres-props-etape-id-update'
import titrePropEtapeIdFind from '../rules/titre-prop-etape-id-find'

// `jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../../database/queries/titres', () => ({
  titreUpdate: jest.fn().mockResolvedValue()
}))

jest.mock('../rules/titre-prop-etape-id-find', () => ({
  default: jest.fn()
}))

console.log = jest.fn()

describe("propriétés (étape) d'un titre", () => {
  test('trouve 8 propriétés dans les étapes', async () => {
    titrePropEtapeIdFind.mockImplementation(() => 'etape-id')
    const titresPropsEtapeIdUpdatelog = await titresPropsEtapeIdUpdate([{}])

    expect(titresPropsEtapeIdUpdatelog).toEqual(
      'Mise à jour: 1 titre(s) (propriétés-étapes).'
    )
    expect(console.log).toHaveBeenCalled()
  })

  test('ne trouve pas de propriétés dans les étapes', async () => {
    titrePropEtapeIdFind.mockImplementation(() => undefined)
    const titresPropsEtapeIdUpdatelog = await titresPropsEtapeIdUpdate([{}])

    expect(titresPropsEtapeIdUpdatelog).toEqual(
      'Mise à jour: 0 titre(s) (propriétés-étapes).'
    )
  })
})
