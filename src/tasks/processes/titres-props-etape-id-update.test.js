import titresPhasesUpdate from './titres-props-etape-id-update'
import titresQueries from '../queries/titres'

import {
  titresUnePropriete,
  titresDeuxProprietes,
  titresVide
} from './__mocks__/titres-props-etape-id-update-titres'

// `jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../queries/titres', () => ({
  titrePropsUpdate: (titre, prop) =>
    titre[prop] && Promise.resolve(titre[prop]),
  calculatedProps: [
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

console.log = jest.fn()

describe("met à jour les propriétés d'un titre", () => {
  test('un titre avec une propriété', async () => {
    expect(await titresPhasesUpdate(titresUnePropriete)).toEqual(
      'Mise à jour: 1 propriétés de titres.'
    )
    expect(console.log).toHaveBeenCalled()
  })

  test('un titre avec deux propriétés', async () => {
    expect(await titresPhasesUpdate(titresDeuxProprietes)).toEqual(
      'Mise à jour: 2 propriétés de titres.'
    )
    expect(console.log).toHaveBeenCalledTimes(2)
  })

  test('un titre sans propriétés', async () => {
    expect(await titresPhasesUpdate(titresVide)).toEqual(
      'Mise à jour: 0 propriétés de titres.'
    )
    expect(console.log).not.toHaveBeenCalled()
  })
})
