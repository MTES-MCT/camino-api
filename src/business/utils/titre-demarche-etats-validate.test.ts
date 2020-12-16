import {
  etapesSuivantesEnAttenteGet,
  titreEtatIdRestrictionsFind,
  titreEtatIdValidate,
  titreEtapesSortAsc
} from './titre-demarche-etats-validate'
import { etatsDefinitionArmRet } from '../demarches-etats-definitions/arm/ret'
import { IDemarcheType, ITitre, ITitreEtape } from '../../types'
import { etatInformationsGet } from '../demarches-etats-definitions/etat-cycles'
import { etatsDefinitionArmOct } from '../demarches-etats-definitions/arm/oct'

describe('teste etapesSuivantesEnAttenteGet', () => {
  test('retourne la seule étape déjà effectuée', () => {
    const etapes = [{ etatId: 'ide' }] as ITitreEtape[]
    const etapesEnAttente = etapesSuivantesEnAttenteGet(
      etapes,
      etapes,
      [],
      etatsDefinitionArmRet
    )
    expect(etapesEnAttente).toHaveLength(1)
    expect(etapesEnAttente[0]).toEqual({ etatId: 'ide' })
  })

  test('retourne la dernière étape d’un arbre avec un seul acteur', () => {
    const etapes = [
      { etatId: 'ide' },
      { etatId: 'mno-ide' },
      { etatId: 'css' }
    ] as ITitreEtape[]
    const etapesEnAttente = etapesSuivantesEnAttenteGet(
      etapes,
      etapes,
      [],
      etatsDefinitionArmRet
    )
    expect(etapesEnAttente).toHaveLength(1)
    expect(etapesEnAttente[0]).toEqual({ etatId: 'css' })
  })

  test('retourne les 2 dernières étapes des chemins parralèles', () => {
    const etapes = [{ etatId: 'ide1' }, { etatId: 'ide2' }] as ITitreEtape[]
    const etapesEnAttente = etapesSuivantesEnAttenteGet(
      etapes,
      etapes,
      [],
      [
        { etatId: 'ide1', justeApres: [] },
        { etatId: 'ide2', justeApres: [] },
        {
          etatId: 'mno',
          justeApres: [[{ etatId: 'ide1' }, { etatId: 'ide2' }]]
        }
      ]
    )
    expect(etapesEnAttente).toHaveLength(2)
    expect(etapesEnAttente[0]).toEqual({ etatId: 'ide1' })
    expect(etapesEnAttente[1]).toEqual({ etatId: 'ide2' })
  })

  test('retourne la dernière étape après la fusion de 2 chemins parralèles', () => {
    const etapes = [
      { etatId: 'ide1' },
      { etatId: 'ide2' },
      { etatId: 'mno' }
    ] as ITitreEtape[]
    const etapesEnAttente = etapesSuivantesEnAttenteGet(
      etapes,
      etapes,
      [],
      [
        { etatId: 'ide1', justeApres: [] },
        { etatId: 'ide2', justeApres: [] },
        {
          etatId: 'mno',
          justeApres: [[{ etatId: 'ide1' }, { etatId: 'ide2' }]]
        }
      ]
    )
    expect(etapesEnAttente).toHaveLength(1)
    expect(etapesEnAttente[0]).toEqual({ etatId: 'mno' })
  })
  test('retourne l’étape sur le premier chemin et l’étape sur le chemin commun', () => {
    const etapes = [{ etatId: 'ide' }, { etatId: 'mno1' }] as ITitreEtape[]
    const etapesEnAttente = etapesSuivantesEnAttenteGet(
      etapes,
      etapes,
      [],
      [
        { etatId: 'ide', separation: ['css'], justeApres: [] },
        {
          etatId: 'mno1',
          justeApres: [[{ etatId: 'ide' }]]
        },
        {
          etatId: 'mno2',
          justeApres: [[{ etatId: 'ide' }]]
        },
        {
          etatId: 'css',
          justeApres: [[{ etatId: 'mno1' }, { etatId: 'mno2' }]]
        }
      ]
    )
    expect(etapesEnAttente).toHaveLength(2)
    expect(etapesEnAttente[0]).toEqual({ etatId: 'ide' })
    expect(etapesEnAttente[1]).toEqual({ etatId: 'mno1' })
  })
  test('retourne l’étape sur la dernière étape sur le chemin commun', () => {
    const etapes = [
      { etatId: 'ide' },
      { etatId: 'mno1' },
      { etatId: 'mno2' },
      { etatId: 'css' }
    ] as ITitreEtape[]
    const etapesEnAttente = etapesSuivantesEnAttenteGet(
      etapes,
      etapes,
      [],
      [
        { etatId: 'ide', separation: ['css'], justeApres: [] },
        {
          etatId: 'mno1',
          justeApres: [[{ etatId: 'ide' }]]
        },
        {
          etatId: 'mno2',
          justeApres: [[{ etatId: 'ide' }]]
        },
        {
          etatId: 'css',
          justeApres: [[{ etatId: 'mno1' }, { etatId: 'mno2' }]]
        }
      ]
    )
    expect(etapesEnAttente).toHaveLength(1)
    expect(etapesEnAttente[0]).toEqual({ etatId: 'css' })
  })
  test('retourne seulement l’étape "rif" dés qu’une demande d’info a commencé', () => {
    const etapes = [{ etatId: 'vfd' }, { etatId: 'mif-mcr' }] as ITitreEtape[]
    const etapesEnAttente = etapesSuivantesEnAttenteGet(
      etapes,
      etapes,
      [],
      [
        { etatId: 'vfd', justeApres: [] },
        ...etatInformationsGet({
          etatId: 'mcr',
          separation: ['eof'],
          justeApres: [[{ etatId: 'vfd' }]]
        })
      ]
    )
    expect(etapesEnAttente).toHaveLength(1)
    expect(etapesEnAttente[0]).toEqual({ etatId: 'mif-mcr' })
  })

  test('retourne la dernière étape sur le chemin commun à la fin du démarche', () => {
    const etapes = [{ etatId: 'dex' }, { etatId: 'mno1' }] as ITitreEtape[]
    const etapesEnAttente = etapesSuivantesEnAttenteGet(
      etapes,
      etapes,
      [],
      [
        { etatId: 'dex', justeApres: [], separation: [] },
        {
          etatId: 'mno1',
          justeApres: [[{ etatId: 'dex' }]]
        },
        {
          etatId: 'mno2',
          justeApres: [[{ etatId: 'dex' }]]
        },
        {
          etatId: 'mno3',
          justeApres: [[{ etatId: 'dex' }]]
        }
      ]
    )
    expect(etapesEnAttente).toHaveLength(2)
    expect(etapesEnAttente[0]).toEqual({ etatId: 'dex' })
  })
})

describe('teste titreEtapesSortAsc', () => {
  test('tri par l’arbre si les étapes ont la même date', () => {
    const etapes = [
      { etatId: 'mcr', date: '2020-01-01', ordre: 18 },
      { etatId: 'vfd', date: '2020-01-01', ordre: 23 },
      { etatId: 'eof', date: '2020-01-01', ordre: 36 }
    ] as ITitreEtape[]

    const result = titreEtapesSortAsc(etapes, etatsDefinitionArmOct)
    expect(result[0].etatId).toEqual('vfd')
    expect(result[1].etatId).toEqual('mcr')
    expect(result[2].etatId).toEqual('eof')
  })
})

describe('teste titreEtatIdRestrictionsFind', () => {
  test('émet une erreur si l’étape est inconnue', () => {
    expect(() =>
      titreEtatIdRestrictionsFind(
        [{ etatId: 'dex', justeApres: [], separation: [] }],
        'aaa'
      )
    ).toThrowError()
  })
})

describe('teste titreEtatIdValidate', () => {
  test('ajoute une étape à une démarche', () => {
    const valid = titreEtatIdValidate(
      { id: 'oct' } as IDemarcheType,
      [],
      { typeId: 'arm' } as ITitre,
      { typeId: 'mfr', etatId: 'mfr' } as ITitreEtape
    )
    expect(valid).toBeNull()
  })

  test('modifie une étape à une démarche', () => {
    const valid = titreEtatIdValidate(
      { id: 'oct' } as IDemarcheType,
      [{ id: '1', typeId: 'mfr', etatId: 'mfr' }] as ITitreEtape[],
      { typeId: 'arm' } as ITitre,
      { id: '1', typeId: 'mfr', etatId: 'mfr' } as ITitreEtape
    )
    expect(valid).toBeNull()
  })
})
