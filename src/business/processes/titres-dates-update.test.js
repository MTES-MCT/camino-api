import titresDateFinDateDebutUpdate from './titres-dates-update'
import { titrePropsUpdate } from '../queries/titres'
import titreDateFinFind from '../rules/titre-date-fin-find'
import titreDateDebutFind from '../rules/titre-date-debut-find'

// `jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../queries/titres', () => ({
  titrePropsUpdate: jest.fn()
}))

jest.mock('../rules/titre-date-fin-find')

jest.mock('../rules/titre-date-debut-find')

console.log = jest.fn()

describe("met à jour les dates de début et de fin d'un titre", () => {
  test('met à jour 2 dates de titres', async () => {
    titreDateFinFind.mockImplementation(() => null)
    titreDateDebutFind.mockImplementation(() => null)
    titrePropsUpdate.mockImplementation(() => Promise.resolve('Mise à jour…'))

    const titresDateFinDateDebutUpdateLog = await titresDateFinDateDebutUpdate([
      { type: { id: 'titre-id' }, statut: { id: 'titre-statut-id' } }
    ])

    expect(titresDateFinDateDebutUpdateLog).toEqual(
      'Mise à jour: 3 dates de titres.'
    )
    expect(console.log).toHaveBeenCalledTimes(3)
  })

  test("aucune mise à jour n'est effectuée", async () => {
    titreDateFinFind.mockImplementation(() => null)
    titreDateDebutFind.mockImplementation(() => null)
    titrePropsUpdate.mockImplementation(() => false)

    const titresDateFinDateDebutUpdateLog = await titresDateFinDateDebutUpdate([
      { type: { id: 'titre-type-id' }, statut: { id: 'titre-statut-id' } }
    ])

    expect(titresDateFinDateDebutUpdateLog).toEqual(
      'Mise à jour: 0 dates de titres.'
    )
    expect(console.log).toHaveBeenCalledTimes(0)
  })
})
