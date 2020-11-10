import { mocked } from 'ts-jest/utils'
import titresDatesUpdate from './titres-dates-update'
import titreDateFinFind from '../rules/titre-date-fin-find'
import titreDateDebutFind from '../rules/titre-date-debut-find'
import titreDateDemandeFind from '../rules/titre-date-demande-find'
import { titresGet } from '../../database/queries/titres'
import Titres from '../../database/models/titres'

jest.mock('../../database/queries/titres', () => ({
  titreUpdate: jest.fn().mockResolvedValue(true),
  titresGet: jest.fn()
}))
jest.mock('../rules/titre-date-fin-find')
jest.mock('../rules/titre-date-debut-find')
jest.mock('../rules/titre-date-demande-find')

const titresGetMock = mocked(titresGet, true)
const titreDateFinFindMock = mocked(titreDateFinFind, true)
const titreDateDebutFindMock = mocked(titreDateDebutFind, true)
const titreDateDemandeFindMock = mocked(titreDateDemandeFind, true)

console.info = jest.fn()

describe("dates d'un titre", () => {
  test("met à jour les dates d'un titre", async () => {
    titresGetMock.mockResolvedValue([{ id: 'titre-id' }] as Titres[])
    titreDateFinFindMock.mockReturnValue('2019-01-01')
    titreDateDebutFindMock.mockReturnValue('2018-01-01')
    titreDateDemandeFindMock.mockReturnValue('2017-01-01')

    const titresDatesUpdated = await titresDatesUpdate()

    expect(titresDatesUpdated.length).toEqual(1)
  })

  test('ne met à jour aucun titre', async () => {
    titresGetMock.mockResolvedValue([
      {
        id: 'titre-type-id',
        dateFin: '2019-01-01',
        dateDebut: null,
        dateDemande: null
      }
    ] as Titres[])
    titreDateFinFindMock.mockReturnValue('2019-01-01')
    titreDateDebutFindMock.mockReturnValue(null)
    titreDateDemandeFindMock.mockReturnValue(null)

    const titresDatesUpdated = await titresDatesUpdate()

    expect(titresDatesUpdated.length).toEqual(0)
  })
})
