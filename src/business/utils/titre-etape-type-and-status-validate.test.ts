import { mocked } from 'ts-jest/utils'
import titreEtapeTypeAndStatusValidate from './titre-etape-type-and-status-validate'
import titreEtapeDemarcheEtapeTypeFind from './titre-etape-demarche-etape-type-find'

import {
  titreEtapeTypeStatutOk,
  titreEtapeStatutKo,
  titreDemarche,
  titreDemarcheEtapeType
} from './__mocks__/titre-etape-type-and-status-validate'

const titreEtapeDemarcheEtapeTypeFindMock = mocked(titreEtapeDemarcheEtapeTypeFind, true)

jest.mock('./titre-etape-demarche-etape-type-find')

describe("valide le type et le statut d'une étape en fonction du type de titre et du type de démarche", () => {
  test("le type et le statut de l'étape correspondent au type de titre et de démarche", () => {
    titreEtapeDemarcheEtapeTypeFindMock.mockReturnValue(titreDemarcheEtapeType)

    expect(titreEtapeTypeAndStatusValidate(titreEtapeTypeStatutOk, titreDemarche)).toBeNull()
  })

  test("le statut de l'étape ne correspond pas au type de titre et de démarche", () => {
    titreEtapeDemarcheEtapeTypeFindMock.mockReturnValue(titreDemarcheEtapeType)

    expect(titreEtapeTypeAndStatusValidate(titreEtapeStatutKo, titreDemarche)).toMatch(/invalide/)
  })
})
