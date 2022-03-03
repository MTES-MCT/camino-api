import { mocked } from 'ts-jest/utils'

import { titresActivitesGet } from '../../database/queries/titres-activites'

import TitresActivites from '../../database/models/titres-activites'
import {
  ACTIVITES_DELAI_RELANCE_JOURS,
  titresActivitesRelanceSend
} from './titres-activites-relance-send'
import { dateAddDays, dateAddMonths } from '../../tools/date'
import dateFormat from 'dateformat'
import { emailsSend } from '../../tools/api-mailjet/emails'

jest.mock('../../database/queries/titres-activites', () => ({
  titresActivitesGet: jest.fn()
}))

jest.mock('../../tools/api-mailjet/emails', () => ({
  __esModule: true,
  emailsSend: jest.fn().mockImplementation(a => a)
}))

const titresActivitesGetMock = mocked(titresActivitesGet, true)
const emailsSendMock = mocked(emailsSend, true)

console.info = jest.fn()

describe('relance les opérateurs des activités qui vont se fermer automatiquement', () => {
  test('envoie un email aux opérateurs', async () => {
    const delaiMois = 3

    const today = dateFormat(new Date(), 'yyyy-mm-dd')
    let date = dateAddDays(today, ACTIVITES_DELAI_RELANCE_JOURS)
    date = dateAddMonths(date, -delaiMois)

    const email = 'toto.huhu@foo.com'

    titresActivitesGetMock.mockResolvedValue([
      {
        date,
        type: { delaiMois },
        titre: {
          titulaires: [{ utilisateurs: [{ email: 'toto.huhu@foo.com' }] }]
        }
      }
    ] as TitresActivites[])
    const titresActivites = await titresActivitesRelanceSend()

    expect(emailsSendMock).toBeCalledWith(
      [email],
      expect.any(String),
      expect.any(String)
    )
    expect(titresActivites.length).toEqual(1)
  })

  test('n’envoie pas d’email aux opérateurs', async () => {
    titresActivitesGetMock.mockResolvedValue([
      {
        date: '1000-01-01',
        type: { delaiMois: 3 }
      }
    ] as TitresActivites[])
    const titresActivites = await titresActivitesRelanceSend()

    expect(titresActivites.length).toEqual(0)
  })
})
