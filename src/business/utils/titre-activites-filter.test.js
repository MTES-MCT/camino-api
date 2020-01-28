import titreActiviteTypeFilter from './titre-activite-filter'
import {
  titreAucunPays,
  titreMAxmGuf,
  titreGPrxFra,
  activiteTypeMAxmPxmGuf,
  activiteTypeGPrxFra
} from './__mocks__/titre-activite-filter-titres'

describe('retourne les activites correspondantes pour un titre', () => {
  test('un titre sans pays ne correspond à aucune activité', () => {
    expect(
      titreActiviteTypeFilter(titreAucunPays, activiteTypeMAxmPxmGuf)
    ).toEqual(false)
  })

  test('un titre AXM de Guyane correspond à une activité de ce type', () => {
    expect(
      titreActiviteTypeFilter(titreMAxmGuf, activiteTypeMAxmPxmGuf)
    ).toEqual(true)
  })

  test('un titre AXM de métropole correspond à une activité de ce type', () => {
    expect(titreActiviteTypeFilter(titreGPrxFra, activiteTypeGPrxFra)).toEqual(
      true
    )
  })

  test('un titre AXM de métropole ne correspond pas à une activité de type AXM de Guyane', () => {
    expect(
      titreActiviteTypeFilter(titreGPrxFra, activiteTypeMAxmPxmGuf)
    ).toEqual(false)
  })
})
