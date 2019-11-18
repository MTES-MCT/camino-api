import titreActiviteNumbersCheck from './titre-activite-numbers-check'
import {
  titreActiviteContenuNumber,
  titreActiviteContenuNumberNeg,
  sections
} from './__mocks__/titre-activite-numbers-check-activites'

describe("vérifie la validité du contenu d'une activité", () => {
  test('une champs de section dont le type est un nombre et qui a une valeur positive est validée', () => {
    expect(
      titreActiviteNumbersCheck(titreActiviteContenuNumber, sections)
    ).toBeNull()
  })

  test('une champs de section dont le type est un nombre et qui a une valeur négative retourne une erreur', () => {
    expect(
      titreActiviteNumbersCheck(titreActiviteContenuNumberNeg, sections)
    ).toEqual('le champs "number" ne peut pas avoir une valeur négative')
  })
})
