import { titreActiviteTypeCheck } from './titre-activite-type-check'
import {
  activiteTypeMAxmPxmGuyane,
  activiteTypeMPrmMetropole,
  activiteTypeWPrwSansPays,
  titreSansPays,
  titreMAxmGuyane,
  titreMAxmMetropole,
  titreMPrmMetropole,
  titrePrwSansPays
} from './__mocks__/titre-activite-type-check'

describe("vérifie si un titre a des activités d'un certain type", () => {
  test("ne retourne aucun type d'activité relié à un pays sur un titre sans pays", () => {
    expect(
      titreActiviteTypeCheck(activiteTypeMAxmPxmGuyane, titreSansPays)
    ).toEqual(false)
  })

  test("retourne un type d'activité sur un titre AXM de Guyane", () => {
    expect(
      titreActiviteTypeCheck(activiteTypeMAxmPxmGuyane, titreMAxmGuyane)
    ).toEqual(true)
  })

  test("ne retourne aucun type d'activité sur un titre AXM de métropole", () => {
    expect(
      titreActiviteTypeCheck(activiteTypeMAxmPxmGuyane, titreMAxmMetropole)
    ).toEqual(false)
  })

  test("retourne un type d'activité sur un titre AXM de métropole", () => {
    expect(
      titreActiviteTypeCheck(activiteTypeMPrmMetropole, titreMPrmMetropole)
    ).toEqual(true)
  })

  test("ne retourne aucun type d'activité de titre AXM Guyane sur un titre PRM de métropole", () => {
    expect(
      titreActiviteTypeCheck(activiteTypeMAxmPxmGuyane, titreMPrmMetropole)
    ).toEqual(false)
  })

  test("retourne un type d'activité de titre  qui n'a pas de pays et qui est liée à un type de titer", () => {
    expect(
      titreActiviteTypeCheck(activiteTypeWPrwSansPays, titrePrwSansPays)
    ).toEqual(true)
  })
})
