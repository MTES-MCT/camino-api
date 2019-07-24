import titresDatesUpdate from './titres-dates-update'
import titreDateFinFind from '../rules/titre-date-fin-find'
import titreDateDebutFind from '../rules/titre-date-debut-find'
import titreDateDemandeFind from '../rules/titre-date-demande-find'

// `jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../../database/queries/titres', () => ({
  titreUpdate: jest.fn().mockResolvedValue()
}))
jest.mock('../rules/titre-date-fin-find')
jest.mock('../rules/titre-date-debut-find')
jest.mock('../rules/titre-date-demande-find')

console.log = jest.fn()

describe("dates d'un titre", () => {
  test("met à jour les dates d'un titre", async () => {
    titreDateFinFind.mockImplementation(() => '2019-01-01')
    titreDateDebutFind.mockImplementation(() => null)
    titreDateDemandeFind.mockImplementation(() => null)

    const titresDatesUpdateLog = await titresDatesUpdate([{ id: 'titre-id' }])

    expect(titresDatesUpdateLog).toEqual(
      'Mise à jour: 1 titre(s) (propriétés-dates).'
    )
    expect(console.log).toHaveBeenCalledTimes(1)
  })

  test('ne met à jour aucun titre', async () => {
    titreDateFinFind.mockImplementation(() => '2019-01-01')
    titreDateDebutFind.mockImplementation(() => null)
    titreDateDemandeFind.mockImplementation(() => null)

    const titresDatesUpdateLog = await titresDatesUpdate([
      {
        id: 'titre-type-id',
        dateFin: new Date('2019-01-01'),
        dateDebut: null,
        dateDemande: null
      }
    ])

    expect(titresDatesUpdateLog).toEqual(
      'Mise à jour: 0 titre(s) (propriétés-dates).'
    )
    expect(console.log).toHaveBeenCalledTimes(0)
  })
})
