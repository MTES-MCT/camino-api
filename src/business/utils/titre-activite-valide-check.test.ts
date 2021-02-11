import { ITitreDemarche } from '../../types'
import { mocked } from 'ts-jest/utils'
import { titreActiviteValideCheck } from './titre-activite-valide-check'

import { titreValideCheck } from './titre-valide-check'

jest.mock('./titre-valide-check', () => ({
  titreValideCheck: jest.fn()
}))

const titreValideCheckMock = mocked(titreValideCheck, true)

describe('validité des activités', () => {
  test("retourne faux si la date de l'activité est après aujourd'hui", () => {
    expect(
      titreActiviteValideCheck(
        '2020-04-01',
        '2020-01-01',
        1,
        2020,
        3,
        [] as ITitreDemarche[],
        'axm'
      )
    ).toEqual(false)
  })

  test("retourne faux si le titre n'est pas valide à cette date", () => {
    titreValideCheckMock.mockReturnValue(false)
    expect(
      titreActiviteValideCheck(
        '2020-04-01',
        '2021-05-01',
        1,
        2020,
        3,
        [] as ITitreDemarche[],
        'axm'
      )
    ).toEqual(false)
  })

  test('retourne vrai si le titre est valide à cette date', () => {
    titreValideCheckMock.mockReturnValue(true)
    expect(
      titreActiviteValideCheck(
        '2020-04-01',
        '2021-05-01',
        1,
        2020,
        3,
        [] as ITitreDemarche[],
        'axm'
      )
    ).toEqual(true)
  })
})
