import activitesTypesFilter from './activites-types-filter'
import {
  titreAucunPays,
  titreMAxmGuf,
  titreMPrmFra,
  activiteTypeMAxmPxmGuf,
  activiteTypeMPrmFra,
  activiteSansPays
} from './__mocks__/activites-types-filter-titres'

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
    expect(activitesTypesFilter(titreMPrmFra, activiteTypeMPrmFra)).toEqual(
      true
    )
  })

  test("ne retourne aucun type d'activité de titre AXM Guyane sur un titre AXM de métropole", () => {
    expect(activitesTypesFilter(titreMPrmFra, activiteTypeMAxmPxmGuf)).toEqual(
      false
    )
  })

  test("ne retourne aucun type d'activité sur une activité qui n'a pas de pays", () => {
    expect(activitesTypesFilter(titreMPrmFra, activiteSansPays)).toEqual(false)
  })
})
