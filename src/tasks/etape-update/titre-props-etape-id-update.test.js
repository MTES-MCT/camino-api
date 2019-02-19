jest.mock('../titres', () => ({
  titrePropsUpdate: (titre, prop) => titre[prop],
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

import titrePhasesUpdate from './titre-props-etape-id-update'
import {
  titreUnePropriete,
  titreDeuxProprietes,
  titreVide
} from './__mocks__/titre-props-etape-id-update-titres'

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
