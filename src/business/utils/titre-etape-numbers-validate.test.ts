import titreEtapeNumbersValidate from './titre-etape-numbers-validate'

import {
  titreEtapesSections,
  titreEtapesSectionsSansElement,
  titreEtapeSansContenu,
  titreEtapeNombresValides,
  titreEtapeNombresNegatifs
} from './__mocks__/titre-etape-numbers-validate'

describe("vérifie la validité des propriétés dont le type est nombre d'une étape", () => {
  test("l'étape n'a pas de contenu", () => {
    expect(
      titreEtapeNumbersValidate(titreEtapeSansContenu, titreEtapesSections)
    ).toEqual(null)
  })

  test("le type d'étape n'a pas de sections", () => {
    expect(
      titreEtapeNumbersValidate(titreEtapeSansContenu, [])
    ).toEqual(null)
  })

  test("la sections n'a pas d'éléments", () => {
    expect(
      titreEtapeNumbersValidate(titreEtapeNombresValides, titreEtapesSectionsSansElement)
    ).toEqual(null)
  })

  test('les propriétés de type nombre ne contiennent pas de valeur négative', () => {
    expect(
      titreEtapeNumbersValidate(titreEtapeNombresValides, titreEtapesSections)
    ).toEqual(null)
  })

  test('les numbers n\'ont pas de coordonnées de référence', () => {
    expect(
      titreEtapeNumbersValidate(titreEtapeNombresNegatifs, titreEtapesSections)
    ).toBe(
      'le champ "duree" ne peut pas avoir une valeur négative, le champ "nombre" ne peut pas avoir une valeur négative'
    )
  })
})
