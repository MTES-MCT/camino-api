import { IDemarcheType, ITitre, ITitreEtape, ITitreType } from '../types'
import { titreDemarcheUpdatedEtatValidate } from './titre-demarche-etat-validate'

describe('teste titreDemarcheUpdatedEtatValidate', () => {
  test('ajoute une étape à une démarche', () => {
    const valid = titreDemarcheUpdatedEtatValidate(
      { id: 'oct' } as IDemarcheType,
      {
        typeId: 'arm',
        type: ({
          id: 'arm',
          propsEtapesTypes: []
        } as unknown) as ITitreType,
        demarches: [{ typeId: 'oct' }]
      } as ITitre,
      { typeId: 'mfr' } as ITitreEtape,
      []
    )
    expect(valid).toHaveLength(0)
  })

  test('modifie une étape à une démarche', () => {
    const valid = titreDemarcheUpdatedEtatValidate(
      { id: 'oct' } as IDemarcheType,
      {
        typeId: 'arm',
        type: ({
          id: 'arm',
          propsEtapesTypes: []
        } as unknown) as ITitreType,
        demarches: [{ typeId: 'oct' }]
      } as ITitre,
      { id: '1', typeId: 'mfr' } as ITitreEtape,
      [{ id: '1', typeId: 'mfr' }] as ITitreEtape[]
    )
    expect(valid).toHaveLength(0)
  })

  test('l’ajout d’une étape d’une démarche historique est valide', () => {
    const valid = titreDemarcheUpdatedEtatValidate(
      { id: 'oct' } as IDemarcheType,
      {
        typeId: 'arm',
        type: ({
          id: 'arm',
          propsEtapesTypes: []
        } as unknown) as ITitreType,
        demarches: [{ typeId: 'oct' }]
      } as ITitre,
      { id: '1', typeId: 'mfr' } as ITitreEtape,
      [{ id: '1', typeId: 'mfr', date: '2000-01-01' }] as ITitreEtape[]
    )
    expect(valid).toHaveLength(0)
  })

  test('l’ajout d’une étape d’une démarche sans étape est valide', () => {
    const valid = titreDemarcheUpdatedEtatValidate(
      { id: 'oct' } as IDemarcheType,
      {
        typeId: 'arm',
        type: ({
          id: 'arm',
          propsEtapesTypes: []
        } as unknown) as ITitreType,
        demarches: [{ typeId: 'oct' }]
      } as ITitre,
      { id: '1', typeId: 'mfr' } as ITitreEtape,
      [] as ITitreEtape[]
    )
    expect(valid).toHaveLength(0)
  })
})
