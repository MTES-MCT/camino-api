import activitesTypesFilter from './activites-types-filter'
import {
  titreAucunPays,
  titreMAxmGuf,
  titreGPrxFra,
  activiteTypeMAxmPxmGuf,
  activiteTypeGPrxFra
} from './__mocks__/titre-activite-filter-titres'

describe("filtre les types d'activités", () => {
  test("ne retourne aucun type d'activité sur un titre sans pays", () => {
    expect(
      activitesTypesFilter(titreAucunPays, activiteTypeMAxmPxmGuf)
    ).toEqual(false)
  })

  test("retourne un type d'activité sur un titre AXM de Guyane", () => {
    expect(activitesTypesFilter(titreMAxmGuf, activiteTypeMAxmPxmGuf)).toEqual(
      true
    )
  })

  test("retourne un type d'activité sur un titre AXM de métropole", () => {
    expect(activitesTypesFilter(titreGPrxFra, activiteTypeGPrxFra)).toEqual(
      true
    )
  })

  test("ne retourne aucun type d'activité de titre AXM Guyane sur un titre AXM de métropole", () => {
    expect(activitesTypesFilter(titreGPrxFra, activiteTypeMAxmPxmGuf)).toEqual(
      false
    )
  })

  test("ne retourne aucun type d'activité sur un titre qui n'a pas de pays", () => {
    expect(activitesTypesFilter(titreGPrxFra, activiteTypeMAxmPxmGuf)).toEqual(
      false
    )
  })
})
