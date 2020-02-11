import titreDemarcheOrdreFind from './titre-demarche-ordre-find'
import { titreDemarches } from './__mocks__/titre-demarche-ordre-find-demarches'

describe("retourne l'ordre de la démarche", () => {
  test("l'ordre de la première démarche est 1", () => {
    expect(
      titreDemarcheOrdreFind('h-cx-courdemanges-1988-oct01', titreDemarches)
    ).toEqual(1)
  })

  test("l'ordre de la deuxième démarche est 2", () => {
    expect(
      titreDemarcheOrdreFind('h-cx-courdemanges-1988-pro01', titreDemarches)
    ).toEqual(2)
  })

  test("l'ordre d'une démarche qui n'existe pas est 0", () => {
    expect(
      titreDemarcheOrdreFind('x-xxx-xxxxxxxx-1xxx-xxx01', titreDemarches)
    ).toEqual(0)
  })
})
