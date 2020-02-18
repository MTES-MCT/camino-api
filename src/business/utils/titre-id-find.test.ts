import { mocked } from 'ts-jest/utils'
import titreIdFind from './titre-id-find'
import titreDemarcheOctroiDateDebutFind from '../rules/titre-demarche-octroi-date-debut-find'
import { ITitre } from '../../types'

jest.mock('../rules/titre-demarche-octroi-date-debut-find', () => ({
  __esModules: true,
  default: jest.fn()
}))

const titreDemarcheOctroiDateDebutFindMock = mocked(
  titreDemarcheOctroiDateDebutFind,
  true
)

describe("trouve l'id d'un titre", () => {
  test("retourne l'id d'un titre en fonction du domaine, type, nom et date d'octroi", () => {
    titreDemarcheOctroiDateDebutFindMock.mockReturnValue('2002-02-02')
    expect(
      titreIdFind({
        id: 'titre-id',
        domaineId: 'm',
        type: { typeId: 'ae' },
        nom: 'test'
      } as ITitre)
    ).toEqual('m-ae-test-2002')
  })
})
