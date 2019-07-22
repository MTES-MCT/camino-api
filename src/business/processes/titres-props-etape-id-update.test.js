import titresPropsEtapeIdUpdate from './titres-props-etape-id-update'
import titrePropEtapeIdFind from '../rules/titre-prop-etape-id-find'

// `jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../queries/titres', () => ({
  titrePropsUpdate: jest.fn().mockResolvedValue(),
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
  default: jest.fn()
}))

console.log = jest.fn()

describe("propriétés (étape) d'un titre", () => {
  test('trouve 8 propriétés dans les étapes', async () => {
    titrePropEtapeIdFind.mockImplementation(() => 'etape-id')
    const titresPropsEtapeIdUpdatelog = await titresPropsEtapeIdUpdate([{}])

    expect(titresPropsEtapeIdUpdatelog).toEqual(
      'Mise à jour: propriétés (étapes) de 1 titre(s).'
    )
    expect(console.log).toHaveBeenCalled()
  })

  test('ne trouve pas de propriétés dans les étapes', async () => {
    titrePropEtapeIdFind.mockImplementation(() => undefined)
    const titresPropsEtapeIdUpdatelog = await titresPropsEtapeIdUpdate([{}])

    expect(titresPropsEtapeIdUpdatelog).toEqual(
      'Mise à jour: propriétés (étapes) de 0 titre(s).'
    )
  })
})
