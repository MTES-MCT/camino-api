import titreTaxesBuild from './titre-taxes-build'
import * as titreTaxeOrCalc from './titre-taxes-or-calc'

import {
  titreVide,
  titreTaxesRco,
  TaxesTypeXxx,
  TaxesTypeRco
} from './__mocks__/titre-taxe-build-titres'

jest.mock('./titre-taxes-or-calc', () => ({
  default: jest.fn()
}))

describe('construction de la liste des taxes pour un titre', () => {
  test('construit les taxes pour un type de taxe pour un titre', () => {
    titreTaxeOrCalc.default.mockImplementation(() => titreTaxesRco)

    const res = titreTaxesBuild(titreVide, TaxesTypeRco)

    expect(res.length).toEqual(2)
    expect(titreTaxeOrCalc.default).toHaveBeenCalled()
  })

  test('ne construit aucune taxe pour un type de taxe pour un titre', () => {
    titreTaxeOrCalc.default.mockImplementation(() => null)

    const res = titreTaxesBuild(titreVide, TaxesTypeRco)

    expect(res.length).toEqual(0)
    expect(titreTaxeOrCalc.default).toHaveBeenCalled()
  })

  test("ne construit pas la taxe si le type n'est pas correct", () => {
    titreTaxeOrCalc.default.mockImplementation(() => null)

    const res = titreTaxesBuild(titreVide, TaxesTypeXxx)

    expect(res).toEqual([])
    expect(titreTaxeOrCalc.default).not.toHaveBeenCalled()
  })
})
