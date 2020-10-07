import activitesTypesFilter from './activites-types-filter'
import {
  activiteTypeMAxmPxmGuyane,
  activiteTypeMPrmMetropole,
  activiteTypeWPrwSansPays,
  titreSansPays,
  titreMAxmGuyane,
  titreMAxmMetropole,
  titreMPrmMetropole,
  titrePrwSansPays
} from './__mocks__/activites-types-filter-titres'

describe("filtre les types d'activités", () => {
  test("ne retourne aucun type d'activité relié à un pays sur un titre sans pays", () => {
    expect(
      activitesTypesFilter(activiteTypeMAxmPxmGuyane, titreSansPays)
    ).toEqual(false)
  })

  test("retourne un type d'activité sur un titre AXM de Guyane", () => {
    expect(
      activitesTypesFilter(activiteTypeMAxmPxmGuyane, titreMAxmGuyane)
    ).toEqual(true)
  })

  test("ne retourne aucun type d'activité sur un titre AXM de métropole", () => {
    expect(
      activitesTypesFilter(activiteTypeMAxmPxmGuyane, titreMAxmMetropole)
    ).toEqual(false)
  })

  test("retourne un type d'activité sur un titre AXM de métropole", () => {
    expect(
      activitesTypesFilter(activiteTypeMPrmMetropole, titreMPrmMetropole)
    ).toEqual(true)
  })

  test("ne retourne aucun type d'activité de titre AXM Guyane sur un titre PRM de métropole", () => {
    expect(
      activitesTypesFilter(activiteTypeMAxmPxmGuyane, titreMPrmMetropole)
    ).toEqual(false)
  })

  test("retourne un type d'activité de titre  qui n'a pas de pays et qui est liée à un type de titer", () => {
    expect(
      activitesTypesFilter(activiteTypeWPrwSansPays, titrePrwSansPays)
    ).toEqual(true)
  })
})
