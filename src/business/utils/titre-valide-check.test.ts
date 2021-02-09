import { mocked } from 'ts-jest/utils'
import { titreValideCheck } from './titre-valide-check'
import { titreDemarches } from './__mocks__/titre-valide-check-demarches'
import { titreStatutIdFind } from '../rules/titre-statut-id-find'
import { ITitreDemarche } from '../../types'

jest.mock('../rules/titre-statut-id-find', () => ({
  __esModule: true,
  titreStatutIdFind: jest.fn()
}))

const titreStatutIdFindMock = mocked(titreStatutIdFind, true)

describe("vérifie la validité d'un titre pendant une période en fonction des phases des démarches", () => {
  test('retourne vrai si le titre est valide pour la période qui commence avant la date de début et termine après la date de fin', () => {
    expect(
      titreValideCheck(titreDemarches, '2005-01-01', '2025-01-01')
    ).toEqual(true)
  })

  test('retourne vrai si le titre est valide pour la période qui commence avant la date de début et termine avant la date de fin', () => {
    expect(
      titreValideCheck(titreDemarches, '2005-01-01', '2015-01-01')
    ).toEqual(true)
  })

  test("retourne faux si le titre n'est pas valide pour la période qui commence avant la date de début et termine avant la date de début", () => {
    expect(
      titreValideCheck(titreDemarches, '2000-01-01', '2005-01-01')
    ).toEqual(false)
  })

  test('retourne vrai si le titre est valide pour la période qui commence avant la date de fin et termine avant la date de fin', () => {
    expect(
      titreValideCheck(titreDemarches, '2015-01-01', '2016-01-01')
    ).toEqual(true)
  })

  test('retourne vrai si le titre est valide pour la période qui commence avant la date de fin et termine après la date de fin', () => {
    expect(
      titreValideCheck(titreDemarches, '2015-10-01', '2025-01-01')
    ).toEqual(true)
  })

  test("retourne faux si le titre n'est pas valide pour la période qui commence après la date de fin", () => {
    expect(
      titreValideCheck(titreDemarches, '2025-01-01', '2030-01-01')
    ).toEqual(false)
  })

  test('retourne vrai si le titre est en modification en instance au moment de la date de début', () => {
    titreStatutIdFindMock.mockReturnValue('mod')
    expect(
      titreValideCheck(titreDemarches, '2020-01-01', '2020-12-31')
    ).toEqual(true)
  })

  test("retourne faux si le titre n'est pas en modification en instance au moment de la date de début", () => {
    titreStatutIdFindMock.mockReturnValue('ech')
    expect(
      titreValideCheck(
        [
          { phase: { dateDebut: '2014-11-02', dateFin: '2019-11-02' } }
        ] as ITitreDemarche[],
        '2020-01-01',
        '2020-12-31'
      )
    ).toEqual(false)
  })
})
