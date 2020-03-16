import titreEtapePointsValidate from './titre-etape-points-validate'

import {
  titreEtapePointsValides,
  titreEtapePointsReferenceManquante
} from './__mocks__/titre-etape-points-validate'

describe("vérifie la validité des coordonnées des points d'une étape", () => {
  test('les points ont des coordonnées de référence', () => {
    expect(
      titreEtapePointsValidate(titreEtapePointsValides)
    ).toEqual(null)
  })

  test('les points n\'ont pas de coordonnées de référence', () => {
    expect(
      titreEtapePointsValidate(titreEtapePointsReferenceManquante)
    ).toMatch(
      /coordonnées du point point-ref-manquante \/ contour contour-ref-manquante \/ groupe undefined manquantes/
    )
  })
})
