import { IDemarcheType, ITitre, ITitreEtape, ITitreType } from '../../types'

import { titreDemarcheUpdatedEtatValidate } from './titre-demarche-etat-validate'

describe('teste titreDemarcheUpdatedEtatValidate', () => {
  test('ajoute une étape à une démarche vide', () => {
    const valid = titreDemarcheUpdatedEtatValidate(
      { id: 'oct' } as IDemarcheType,
      {
        typeId: 'arm',
        type: ({
          id: 'arm',
          contenuIds: []
        } as unknown) as ITitreType,
        demarches: [{ typeId: 'oct' }]
      } as ITitre,
      { typeId: 'mfr', date: '2030-01-01' } as ITitreEtape,
      null
    )

    expect(valid).toHaveLength(0)
  })

  test('ajoute une étape à une démarche qui contient déjà une étape', () => {
    const valid = titreDemarcheUpdatedEtatValidate(
      { id: 'oct' } as IDemarcheType,
      {
        typeId: 'arm',
        type: ({
          id: 'arm',
          contenuIds: []
        } as unknown) as ITitreType,
        demarches: [{ typeId: 'pro' }, { typeId: 'oct' }]
      } as ITitre,
      { typeId: 'dae' } as ITitreEtape,
      [{ id: '1', typeId: 'mfr', statutId: 'dep' }] as ITitreEtape[]
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
          contenuIds: []
        } as unknown) as ITitreType,
        demarches: [{ typeId: 'oct' }]
      } as ITitre,
      { id: '1', typeId: 'mfr', statutId: 'dep' } as ITitreEtape,
      [
        { id: '1', typeId: 'mfr', statutId: 'aco' },
        { id: '2', typeId: 'dae' }
      ] as ITitreEtape[]
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
          contenuIds: []
        } as unknown) as ITitreType,
        demarches: [{ typeId: 'oct' }]
      } as ITitre,
      { id: '1', typeId: 'mfr' } as ITitreEtape,
      [{ id: '1', typeId: 'mfr', date: '2000-01-01' }] as ITitreEtape[],
      false
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
          contenuIds: []
        } as unknown) as ITitreType,
        demarches: [{ typeId: 'oct' }]
      } as ITitre,
      { id: '1', typeId: 'mfr' } as ITitreEtape,
      [] as ITitreEtape[]
    )

    expect(valid).toHaveLength(0)
  })

  test("retourne une erreur si la démarche en cours de modification n'existe pas", () => {
    expect(() =>
      titreDemarcheUpdatedEtatValidate(
        { id: 'oct' } as IDemarcheType,
        {
          typeId: 'arm',
          type: ({
            id: 'arm',
            contenuIds: []
          } as unknown) as ITitreType,
          demarches: [{ typeId: 'pro' }]
        } as ITitre,
        { id: '1', typeId: 'mfr' } as ITitreEtape,
        [] as ITitreEtape[]
      )
    ).toThrow()

    expect(() =>
      titreDemarcheUpdatedEtatValidate(
        { id: 'oct' } as IDemarcheType,
        {
          typeId: 'arm',
          type: ({
            id: 'arm',
            contenuIds: []
          } as unknown) as ITitreType
        } as ITitre,
        { id: '1', typeId: 'mfr' } as ITitreEtape,
        [] as ITitreEtape[]
      )
    ).toThrow()
  })

  test('supprime une étape', () => {
    const valid = titreDemarcheUpdatedEtatValidate(
      { id: 'oct' } as IDemarcheType,
      {
        typeId: 'arm',
        type: ({
          id: 'arm',
          contenuIds: []
        } as unknown) as ITitreType,
        demarches: [{ typeId: 'oct' }]
      } as ITitre,
      { id: '1', typeId: 'mfr' } as ITitreEtape,
      [{ id: '1', typeId: 'mfr' }] as ITitreEtape[],
      true
    )

    expect(valid).toHaveLength(0)
  })

  test("ajoute une étape à une démarche sans arbre d'instruction", () => {
    const valid = titreDemarcheUpdatedEtatValidate(
      { id: 'oct' } as IDemarcheType,
      {
        typeId: 'arm',
        type: ({
          id: 'arm',
          contenuIds: []
        } as unknown) as ITitreType,
        demarches: [{ typeId: 'oct' }]
      } as ITitre,
      { typeId: 'mfr', date: '1030-01-01' } as ITitreEtape
    )

    expect(valid).toHaveLength(0)
  })
})
