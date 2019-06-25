import titresPropsEtapeIdUpdate from './titres-props-etape-id-update'
import { titrePropUpdate } from '../queries/titres'

// `jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../queries/titres', () => ({
  titrePropUpdate: jest.fn(),
  titrePropsEtapes: [
    'points',
    'titulaires',
    'amodiataires',
    'administrations',
    'surface',
    'volume',
    'substances',
    'communes'
  ]
}))

jest.mock('../rules/titre-prop-etape-id-find', () => ({
  default: () => 'etape-id'
}))

console.log = jest.fn()

describe("propriétés (étape) d'un titre", () => {
  test('trouve 8 propriétés dans les étapes', async () => {
    titrePropUpdate.mockImplementation(() => Promise.resolve('Mise à jour…'))
    const titresPropsEtapeIdUpdatelog = await titresPropsEtapeIdUpdate([{}])

    expect(titresPropsEtapeIdUpdatelog).toEqual(
      'Mise à jour: 8 propriétés (étapes) de titres.'
    )
    expect(console.log).toHaveBeenCalled()
  })

  test('ne trouve pas de propriétés dans les étapes', async () => {
    titrePropUpdate.mockImplementation(() => false)
    const titresPropsEtapeIdUpdatelog = await titresPropsEtapeIdUpdate([{}])

    expect(titresPropsEtapeIdUpdatelog).toEqual(
      'Mise à jour: 0 propriétés (étapes) de titres.'
    )
  })
})
