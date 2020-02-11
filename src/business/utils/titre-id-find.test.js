import titreIdFind from './titre-id-find'
import * as titreDemarcheOctroiDateDebutFind from '../rules/titre-demarche-octroi-date-debut-find'

jest.mock('../rules/titre-demarche-octroi-date-debut-find', () => ({
  default: jest.fn()
}))

describe("trouve l'id d'un titre", () => {
  test("retourne l'id d'un titre en fonction du domaine, type, nom et date d'octroi", () => {
    titreDemarcheOctroiDateDebutFind.default.mockImplementation(
      () => '2002-02-02'
    )
    expect(
      titreIdFind({
        id: 'titre-id',
        domaineId: 'm',
        type: { typeId: 'ae' },
        nom: 'test'
      })
    ).toEqual('m-ae-test-2002')
  })
})
