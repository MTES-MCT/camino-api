import { activiteTypeTitreCheck } from './activite-type-titre-check'
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

describe("vérifie que le titre a des types d'activités", () => {
  test("ne retourne aucun type d'activité relié à un pays sur un titre sans pays", () => {
    expect(
      activiteTypeTitreCheck(activiteTypeMAxmPxmGuyane, titreSansPays)
    ).toEqual(false)
  })

  test("retourne un type d'activité sur un titre AXM de Guyane", () => {
    expect(
      activiteTypeTitreCheck(activiteTypeMAxmPxmGuyane, titreMAxmGuyane)
    ).toEqual(true)
  })

  test("ne retourne aucun type d'activité sur un titre AXM de métropole", () => {
    expect(
      activiteTypeTitreCheck(activiteTypeMAxmPxmGuyane, titreMAxmMetropole)
    ).toEqual(false)
  })

  test("retourne un type d'activité sur un titre AXM de métropole", () => {
    expect(
      activiteTypeTitreCheck(activiteTypeMPrmMetropole, titreMPrmMetropole)
    ).toEqual(true)
  })

  test("ne retourne aucun type d'activité de titre AXM Guyane sur un titre PRM de métropole", () => {
    expect(
      activiteTypeTitreCheck(activiteTypeMAxmPxmGuyane, titreMPrmMetropole)
    ).toEqual(false)
  })

  test("retourne un type d'activité de titre  qui n'a pas de pays et qui est liée à un type de titer", () => {
    expect(
      activiteTypeTitreCheck(activiteTypeWPrwSansPays, titrePrwSansPays)
    ).toEqual(true)
  })
})
