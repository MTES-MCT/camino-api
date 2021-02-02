import { titreValideCheck } from './titre-valide-check'
import { titreDemarches } from './__mocks__/titre-valide-check-demarches'

describe("vérifie la validité d'un titre pendant une période en fonction des phases des démarches", () => {
  test('le titre est valide pour la période qui commence avant la date de début et termine après la date de fin', () => {
    expect(
      titreValideCheck(titreDemarches, '2005-01-01', '2025-01-01')
    ).toEqual(true)
  })

  test('le titre est valide pour la période qui commence avant la date de début et termine avant la date de fin', () => {
    expect(
      titreValideCheck(titreDemarches, '2005-01-01', '2015-01-01')
    ).toEqual(true)
  })

  test("le titre n'est pas valide pour la période qui commence avant la date de début et termine avant la date de début", () => {
    expect(
      titreValideCheck(titreDemarches, '2000-01-01', '2005-01-01')
    ).toEqual(false)
  })

  test('le titre est valide pour la période qui commence avant la date de fin et termine avant la date de fin', () => {
    expect(
      titreValideCheck(titreDemarches, '2015-01-01', '2016-01-01')
    ).toEqual(true)
  })

  test('le titre est valide pour la période qui commence avant la date de fin et termine après la date de fin', () => {
    expect(
      titreValideCheck(titreDemarches, '2015-10-01', '2025-01-01')
    ).toEqual(true)
  })

  test("le titre n'est pas valide pour la période qui commence après la date de fin", () => {
    expect(
      titreValideCheck(titreDemarches, '2025-01-01', '2030-01-01')
    ).toEqual(false)
  })
})
