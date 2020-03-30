import { IEtapeType } from '../../types'

import titreEtapeTypeAndStatusValidate from './titre-etape-type-and-status-validate'

describe("valide le type et le statut d'une étape en fonction du type de titre et du type de démarche", () => {
  test("le type et le statut de l'étape correspondent au type de titre et de démarche", () => {
    expect(titreEtapeTypeAndStatusValidate(
      'xxx',
      'ok',
      [{
        id: 'xxx',
        etapesStatuts: [{ id: 'ok' }]
      }] as IEtapeType[],
      ''
    )).toBeNull()
  })

  test("le statut de l'étape ne correspond pas au type de titre et de démarche", () => {
    expect(titreEtapeTypeAndStatusValidate(
      'xxx',
      'ko',
      [{
        id: 'xxx',
        etapesStatuts: [{ id: 'ok' }]
      }] as IEtapeType[],
      ''
    )).toMatch(/invalide/)
  })
})
