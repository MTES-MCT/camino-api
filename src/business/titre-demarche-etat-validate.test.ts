import { IDemarcheType, ITitre, ITitreEtape } from '../types'
import { titreDemarcheUpdatedEtatValidate } from './titre-demarche-etat-validate'

describe('teste titreDemarcheUpdatedEtatValidate', () => {
  test('ajoute une étape à une démarche', () => {
    const valid = titreDemarcheUpdatedEtatValidate(
      { id: 'oct' } as IDemarcheType,
      [],
      { typeId: 'arm', demarches: [{ typeId: 'oct' }] } as ITitre,
      { typeId: 'mfr' } as ITitreEtape
    )
    expect(valid).toBeNull()
  })

  test('modifie une étape à une démarche', () => {
    const valid = titreDemarcheUpdatedEtatValidate(
      { id: 'oct' } as IDemarcheType,
      [{ id: '1', typeId: 'mfr' }] as ITitreEtape[],
      { typeId: 'arm', demarches: [{ typeId: 'oct' }] } as ITitre,
      { id: '1', typeId: 'mfr' } as ITitreEtape
    )
    expect(valid).toBeNull()
  })

  test('l’ajout d’une étape d’une démarche historique est valide', () => {
    const valid = titreDemarcheUpdatedEtatValidate(
      { id: 'oct' } as IDemarcheType,
      [{ id: '1', typeId: 'mfr', date: '2000-01-01' }] as ITitreEtape[],
      { typeId: 'arm', demarches: [{ typeId: 'oct' }] } as ITitre,
      { id: '1', typeId: 'mfr' } as ITitreEtape
    )
    expect(valid).toBeNull()
  })

  test('l’ajout d’une étape d’une démarche sans étape est valide', () => {
    const valid = titreDemarcheUpdatedEtatValidate(
      { id: 'oct' } as IDemarcheType,
      [] as ITitreEtape[],
      { typeId: 'arm', demarches: [{ typeId: 'oct' }] } as ITitre,
      { id: '1', typeId: 'mfr' } as ITitreEtape
    )
    expect(valid).toBeNull()
  })
})
