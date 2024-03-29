import { mocked } from 'jest-mock'
import { IEtapeType } from '../../types'

import { titreEtapeTypeAndStatusValidate } from './titre-etape-type-and-status-validate'
import { titreEtapeDemarcheEtapeTypeFind } from '../utils/titre-etape-demarche-etape-type-find'

jest.mock('../utils/titre-etape-demarche-etape-type-find', () => ({
  titreEtapeDemarcheEtapeTypeFind: jest.fn()
}))

const titreEtapeDemarcheEtapeTypeFindMock = mocked(
  titreEtapeDemarcheEtapeTypeFind,
  true
)

describe("valide le type et le statut d'une étape en fonction du type de titre et du type de démarche", () => {
  test('le statut est obligatoire', () => {
    expect(
      titreEtapeTypeAndStatusValidate(
        'xxx',
        undefined,
        [
          {
            id: 'xxx',
            etapesStatuts: [{ id: 'ok' }]
          }
        ] as IEtapeType[],
        ''
      )
    ).toEqual(['le statut est obligatoire'])
  })
  test("le type et le statut de l'étape correspondent au type de titre et de démarche", () => {
    titreEtapeDemarcheEtapeTypeFindMock.mockReturnValue({
      id: 'xxx',
      etapesStatuts: [{ id: 'ok' }]
    } as IEtapeType)

    expect(
      titreEtapeTypeAndStatusValidate(
        'xxx',
        'ok',
        [
          {
            id: 'xxx',
            etapesStatuts: [{ id: 'ok' }]
          }
        ] as IEtapeType[],
        ''
      )
    ).toHaveLength(0)
  })

  test("le statut de l'étape ne correspond pas au type de titre et de démarche", () => {
    titreEtapeDemarcheEtapeTypeFindMock.mockReturnValue({
      id: 'xxx',
      etapesStatuts: [{ id: 'ok' }]
    } as IEtapeType)
    expect(
      titreEtapeTypeAndStatusValidate(
        'xxx',
        'ko',
        [
          {
            id: 'xxx',
            etapesStatuts: [{ id: 'ok' }]
          }
        ] as IEtapeType[],
        'toto'
      )
    ).toEqual([
      'statut de l\'étape "ko" invalide pour une type d\'étape xxx pour une démarche de type toto'
    ])
  })

  test("le statut de l'étape ne correspond pas au type de titre et de démarche", () => {
    titreEtapeDemarcheEtapeTypeFindMock.mockImplementation(() => {
      throw new Error('erreur titreEtapeDemarcheEtapeTypeFind')
    })
    expect(
      titreEtapeTypeAndStatusValidate(
        'xxx',
        'ko',
        [
          {
            id: 'xxx',
            etapesStatuts: [{ id: 'ok' }]
          }
        ] as IEtapeType[],
        'toto'
      )
    ).toEqual(['erreur titreEtapeDemarcheEtapeTypeFind'])
  })
})
