import titrePhasesUpdate from './titre-props-etape-id-update'
import titresQueries from '../titres'

import {
  titreUnePropriete,
  titreDeuxProprietes,
  titreVide
} from './__mocks__/titre-props-etape-id-update-titres'

// `jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../titres', () => ({
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
    expect(await titrePhasesUpdate(titreUnePropriete)).toEqual(
      'Mise à jour: 1 propriétés de titres.'
    )
  })

  test('un titre avec deux propriétés', async () => {
    expect(await titrePhasesUpdate(titreDeuxProprietes)).toEqual(
      'Mise à jour: 2 propriétés de titres.'
    )
  })

  test('un titre sans propriétés', async () => {
    expect(await titrePhasesUpdate(titreVide)).toEqual(
      'Mise à jour: 0 propriétés de titres.'
    )
  })
})
