import { mocked } from 'ts-jest/utils'
import { ITitre } from '../../types'
import titresDatesUpdate from './titres-dates-update'
import titreDateFinFind from '../rules/titre-date-fin-find'
import titreDateDebutFind from '../rules/titre-date-debut-find'
import titreDateDemandeFind from '../rules/titre-date-demande-find'

jest.mock('../../database/queries/titres', () => ({
  titreUpdate: jest.fn().mockResolvedValue(true)
}))
jest.mock('../rules/titre-date-fin-find')
jest.mock('../rules/titre-date-debut-find')
jest.mock('../rules/titre-date-demande-find')

const titreDateFinFindMock = mocked(titreDateFinFind, true)
const titreDateDebutFindMock = mocked(titreDateDebutFind, true)
const titreDateDemandeFindMock = mocked(titreDateDemandeFind, true)

console.info = jest.fn()

describe("dates d'un titre", () => {
  test("met à jour les dates d'un titre", async () => {
    titreDateFinFindMock.mockReturnValue('2019-01-01')
    titreDateDebutFindMock.mockReturnValue('2018-01-01')
    titreDateDemandeFindMock.mockReturnValue('2017-01-01')

    const titresDatesUpdated = await titresDatesUpdate([
      { id: 'titre-id' }
    ] as ITitre[])

    expect(titresDatesUpdated.length).toEqual(1)
    expect(console.info).toHaveBeenCalledTimes(1)
  })

  test('ne met à jour aucun titre', async () => {
    titreDateFinFindMock.mockReturnValue('2019-01-01')
    titreDateDebutFindMock.mockReturnValue(null)
    titreDateDemandeFindMock.mockReturnValue(null)

    const titresDatesUpdated = await titresDatesUpdate([
      {
        id: 'titre-type-id',
        dateFin: '2019-01-01',
        dateDebut: null,
        dateDemande: null
      }
    ] as ITitre[])

    expect(titresDatesUpdated.length).toEqual(0)
    expect(console.info).toHaveBeenCalledTimes(0)
  })
})
