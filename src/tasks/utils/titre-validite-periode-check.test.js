import titreValiditePeriodeCheck from './titre-validite-periode-check'
import { titre } from './__mocks__/titre-validite-periode-check-titres'

describe("retourne l'ordre de la démarche", () => {
  test('le titre est valide pour la période qui commence avant la date de début et termine après la date de fin', () => {
    expect(
      titreValiditePeriodeCheck(
        titre,
        new Date('2005-01-01'),
        new Date('2025-01-01')
      )
    ).toEqual(true)
  })

  test('le titre est valide pour la période qui commence avant la date de début et termine avant la date de fin', () => {
    expect(
      titreValiditePeriodeCheck(
        titre,
        new Date('2005-01-01'),
        new Date('2015-01-01')
      )
    ).toEqual(true)
  })

  test("le titre n'est pas valide pour la période qui commence avant la date de début et termine avant la date de début", () => {
    expect(
      titreValiditePeriodeCheck(
        titre,
        new Date('2000-01-01'),
        new Date('2005-01-01')
      )
    ).toEqual(false)
  })

  test('le titre est valide pour la période qui commence avant la date de fin et termine avant la date de fin', () => {
    expect(
      titreValiditePeriodeCheck(
        titre,
        new Date('2015-01-01'),
        new Date('2016-01-01')
      )
    ).toEqual(true)
  })

  test('le titre est valide pour la période qui commence avant la date de fin et termine après la date de fin', () => {
    expect(
      titreValiditePeriodeCheck(
        titre,
        new Date('2015-10-01'),
        new Date('2025-01-01')
      )
    ).toEqual(true)
  })

  test("le titre n'est pas valide pour la période qui commence après la date de fin", () => {
    expect(
      titreValiditePeriodeCheck(
        titre,
        new Date('2025-01-01'),
        new Date('2030-01-01')
      )
    ).toEqual(false)
  })
})
