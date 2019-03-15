import titreActivitesTypesFilter from './titre-activites-filter'
import {
  titreHCxxFra,
  titreMAxmGuf,
  titreGPrxFra,
  activitesTypes,
  activiteTypeMAxmPxmGuf,
  activiteTypeGPrxFra
} from './__mocks__/titre-activites-filter-titres'

describe('retourne les activites correspondantes pour un titre', () => {
  test("titre H CXX de métropole ne correspond à aucun type d'activité", () => {
    expect(titreActivitesTypesFilter(titreHCxxFra, activitesTypes)).toEqual([])
  })

  test('un titre AXM de Guyane correspond à une activité de ce type', () => {
    expect(titreActivitesTypesFilter(titreMAxmGuf, activitesTypes)).toEqual([
      activiteTypeMAxmPxmGuf
    ])
  })

  test('un titre AXM de métropole correspond à une activité de ce type', () => {
    expect(titreActivitesTypesFilter(titreGPrxFra, activitesTypes)).toEqual([
      activiteTypeGPrxFra
    ])
  })
})
