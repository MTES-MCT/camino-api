import { contenuNumbersCheck } from './contenu-numbers-check'
import {
  contenuNumber,
  contenuNumberNeg,
  sections,
  sectionsSansElement
} from '../__mocks__/contenu-numbers-check-contenus'

describe('vérifie la validité du contenu de type nombre', () => {
  test("la sections n'a pas d'éléments", () => {
    expect(contenuNumbersCheck(sectionsSansElement, contenuNumber)).toEqual(
      null
    )
  })

  test('un champ de section dont le type est un nombre et qui a une valeur positive est validée', () => {
    expect(contenuNumbersCheck(sections, contenuNumber)).toBeNull()
  })

  test('un champ de section dont le type est un nombre et qui a une valeur négative retourne une erreur', () => {
    expect(contenuNumbersCheck(sections, contenuNumberNeg)).toEqual(
      'le champ "number" ne peut pas avoir une valeur négative'
    )
  })
})
