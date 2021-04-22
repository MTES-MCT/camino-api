import { contenuDatesCheck } from './contenu-dates-check'

import {
  sections,
  sectionsSansElement,
  contenuDatesValides,
  contenuDatesInvalides
} from '../__mocks__/contenu-dates-check-contenus'

describe("vérifie la validité des propriétés dont le type est date d'une étape", () => {
  test("la sections n'a pas d'éléments", () => {
    expect(contenuDatesCheck(sectionsSansElement, contenuDatesValides)).toEqual(
      null
    )
  })

  test('les propriétés de type date ne contiennent pas de valeur négative', () => {
    expect(contenuDatesCheck(sections, contenuDatesValides)).toEqual(null)
  })

  test("les dates n'ont pas de coordonnées de référence", () => {
    expect(contenuDatesCheck(sections, contenuDatesInvalides)).toBe(
      'le champ "date" n\'est pas une date valide'
    )
  })
})
