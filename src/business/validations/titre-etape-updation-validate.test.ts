import { ISubstance, ITitreEtape, ITitrePoint } from '../../types'

import { titreEtapeCompleteValidate } from './titre-etape-updation-validate'

describe('valide l’étape avant de l’enregistrer', () => {
  test.each`
    substances          | etapeType | titreType | error
    ${[]}               | ${'mfr'}  | ${'arm'}  | ${true}
    ${[]}               | ${'mfr'}  | ${'axm'}  | ${true}
    ${[]}               | ${'rde'}  | ${'arm'}  | ${false}
    ${[]}               | ${'mfr'}  | ${'prm'}  | ${false}
    ${[{ id: 'auru' }]} | ${'mfr'}  | ${'arm'}  | ${false}
    ${[{ id: 'auru' }]} | ${'mfr'}  | ${'axm'}  | ${false}
    ${[{}]}             | ${'mfr'}  | ${'axm'}  | ${true}
  `(
    'teste la complétude des substances',
    ({
      substances,
      etapeType,
      titreType,
      error
    }: {
      substances: ISubstance[]
      etapeType: string
      titreType: string
      error: boolean
    }) => {
      const titreEtape = {
        substances,
        typeId: etapeType
      } as ITitreEtape

      const errors = titreEtapeCompleteValidate(
        titreEtape,
        titreType,
        [],
        [],
        null,
        [],
        null
      )

      const errorLabel = 'au moins une substance doit être renseignée'

      if (error) {
        expect(errors).toContain(errorLabel)
      } else {
        expect(errors).not.toContain(errorLabel)
      }
    }
  )

  test.each`
    points              | etapeType | titreType | error
    ${[]}               | ${'mfr'}  | ${'arm'}  | ${true}
    ${[]}               | ${'mfr'}  | ${'axm'}  | ${true}
    ${[]}               | ${'rde'}  | ${'arm'}  | ${false}
    ${[]}               | ${'mfr'}  | ${'prm'}  | ${false}
    ${[{}, {}, {}, {}]} | ${'mfr'}  | ${'arm'}  | ${false}
    ${[{}, {}, {}, {}]} | ${'mfr'}  | ${'axm'}  | ${false}
    ${[{}, {}, {}]}     | ${'mfr'}  | ${'axm'}  | ${true}
  `(
    'teste la complétude du périmètre',
    ({
      points,
      etapeType,
      titreType,
      error
    }: {
      points: ITitrePoint[]
      etapeType: string
      titreType: string
      error: boolean
    }) => {
      const titreEtape = {
        points,
        typeId: etapeType
      } as ITitreEtape

      const errors = titreEtapeCompleteValidate(
        titreEtape,
        titreType,
        [],
        [],
        null,
        [],
        null
      )

      const errorLabel = 'le périmètre doit comporter au moins 4 points'
      if (error) {
        expect(errors).toContain(errorLabel)
      } else {
        expect(errors).not.toContain(errorLabel)
      }
    }
  )

  test('une ARM mécanisée a des documents obligatoires supplémentaires', () => {
    const titreEtape = {
      typeId: 'mfr',
      contenu: { arm: { mecanise: true } }
    } as unknown as ITitreEtape

    const errors = titreEtapeCompleteValidate(
      titreEtape,
      'arm',
      [],
      [
        { id: 'doe', optionnel: true, nom: 'doe' },
        { id: 'dep', optionnel: true, nom: 'doe' },
        { id: 'tot', optionnel: true, nom: 'tot' }
      ],
      null,
      [],
      null
    )
    expect(errors).toContain('le document "doe" est obligatoire')
    expect(errors).toContain('le document "dep" est obligatoire')
    expect(errors).not.toContain('le document "tot" est obligatoire')
  })
})
