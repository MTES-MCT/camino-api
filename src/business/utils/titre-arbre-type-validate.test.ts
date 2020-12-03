import {
  etapesSuivantesEnAttenteGet,
  titreEtapesSortAsc
} from './titre-arbre-type-validate'
import { arbreArmRet } from '../arbres-demarches/arm/ret'
import { ITitreEtape } from '../../types'
import { arbreInformationsGet } from '../arbres-demarches/arbres-annexes'
import { arbreArmOct } from '../arbres-demarches/arm/oct'

describe('teste etapesSuivantesEnAttenteGet', () => {
  test('retourne la seule étape déjà effectuée', () => {
    const etapes = [{ arbreTypeId: 'ide' }] as ITitreEtape[]
    const etapesEnAttente = etapesSuivantesEnAttenteGet(
      etapes,
      etapes,
      [],
      arbreArmRet
    )
    expect(etapesEnAttente).toHaveLength(1)
    expect(etapesEnAttente[0]).toEqual({ arbreTypeId: 'ide' })
  })

  test('retourne la dernière étape d’un arbre avec un seul acteur', () => {
    const etapes = [
      { arbreTypeId: 'ide' },
      { arbreTypeId: 'mno-ide' },
      { arbreTypeId: 'css' }
    ] as ITitreEtape[]
    const etapesEnAttente = etapesSuivantesEnAttenteGet(
      etapes,
      etapes,
      [],
      arbreArmRet
    )
    expect(etapesEnAttente).toHaveLength(1)
    expect(etapesEnAttente[0]).toEqual({ arbreTypeId: 'css' })
  })

  test('retourne les 2 dernières étapes des chemins parralèles', () => {
    const etapes = [
      { arbreTypeId: 'ide1' },
      { arbreTypeId: 'ide2' }
    ] as ITitreEtape[]
    const etapesEnAttente = etapesSuivantesEnAttenteGet(
      etapes,
      etapes,
      [],
      [
        { arbreTypeId: 'ide1', justeApres: [] },
        { arbreTypeId: 'ide2', justeApres: [] },
        {
          arbreTypeId: 'mno',
          justeApres: [[{ arbreTypeId: 'ide1' }, { arbreTypeId: 'ide2' }]]
        }
      ]
    )
    expect(etapesEnAttente).toHaveLength(2)
    expect(etapesEnAttente[0]).toEqual({ arbreTypeId: 'ide1' })
    expect(etapesEnAttente[1]).toEqual({ arbreTypeId: 'ide2' })
  })

  test('retourne la dernière étape après la fusion de 2 chemins parralèles', () => {
    const etapes = [
      { arbreTypeId: 'ide1' },
      { arbreTypeId: 'ide2' },
      { arbreTypeId: 'mno' }
    ] as ITitreEtape[]
    const etapesEnAttente = etapesSuivantesEnAttenteGet(
      etapes,
      etapes,
      [],
      [
        { arbreTypeId: 'ide1', justeApres: [] },
        { arbreTypeId: 'ide2', justeApres: [] },
        {
          arbreTypeId: 'mno',
          justeApres: [[{ arbreTypeId: 'ide1' }, { arbreTypeId: 'ide2' }]]
        }
      ]
    )
    expect(etapesEnAttente).toHaveLength(1)
    expect(etapesEnAttente[0]).toEqual({ arbreTypeId: 'mno' })
  })
  test('retourne l’étape sur le premier chemin et l’étape sur le chemin commun', () => {
    const etapes = [
      { arbreTypeId: 'ide' },
      { arbreTypeId: 'mno1' }
    ] as ITitreEtape[]
    const etapesEnAttente = etapesSuivantesEnAttenteGet(
      etapes,
      etapes,
      [],
      [
        { arbreTypeId: 'ide', separation: ['css'], justeApres: [] },
        {
          arbreTypeId: 'mno1',
          justeApres: [[{ arbreTypeId: 'ide' }]]
        },
        {
          arbreTypeId: 'mno2',
          justeApres: [[{ arbreTypeId: 'ide' }]]
        },
        {
          arbreTypeId: 'css',
          justeApres: [[{ arbreTypeId: 'mno1' }, { arbreTypeId: 'mno2' }]]
        }
      ]
    )
    expect(etapesEnAttente).toHaveLength(2)
    expect(etapesEnAttente[0]).toEqual({ arbreTypeId: 'ide' })
    expect(etapesEnAttente[1]).toEqual({ arbreTypeId: 'mno1' })
  })
  test('retourne l’étape sur la dernière étape sur le chemin commun', () => {
    const etapes = [
      { arbreTypeId: 'ide' },
      { arbreTypeId: 'mno1' },
      { arbreTypeId: 'mno2' },
      { arbreTypeId: 'css' }
    ] as ITitreEtape[]
    const etapesEnAttente = etapesSuivantesEnAttenteGet(
      etapes,
      etapes,
      [],
      [
        { arbreTypeId: 'ide', separation: ['css'], justeApres: [] },
        {
          arbreTypeId: 'mno1',
          justeApres: [[{ arbreTypeId: 'ide' }]]
        },
        {
          arbreTypeId: 'mno2',
          justeApres: [[{ arbreTypeId: 'ide' }]]
        },
        {
          arbreTypeId: 'css',
          justeApres: [[{ arbreTypeId: 'mno1' }, { arbreTypeId: 'mno2' }]]
        }
      ]
    )
    expect(etapesEnAttente).toHaveLength(1)
    expect(etapesEnAttente[0]).toEqual({ arbreTypeId: 'css' })
  })
  test('retourne seulement l’étape "rif" dés qu’une demande d’info a commencé', () => {
    const etapes = [
      { arbreTypeId: 'vfd' },
      { arbreTypeId: 'mif-mcr' }
    ] as ITitreEtape[]
    const etapesEnAttente = etapesSuivantesEnAttenteGet(
      etapes,
      etapes,
      [],
      [
        { arbreTypeId: 'vfd', justeApres: [] },
        ...arbreInformationsGet({
          arbreTypeId: 'mcr',
          separation: ['eof'],
          justeApres: [[{ arbreTypeId: 'vfd' }]]
        })
      ]
    )
    expect(etapesEnAttente).toHaveLength(1)
    expect(etapesEnAttente[0]).toEqual({ arbreTypeId: 'mif-mcr' })
  })
})

describe('teste titreEtapesSortAsc', () => {
  test('tri par l’arbre si les étapes ont la même date', () => {
    const etapes = [
      { arbreTypeId: 'mcr', date: '2020-01-01', ordre: 18 },
      { arbreTypeId: 'vfd', date: '2020-01-01', ordre: 23 },
      { arbreTypeId: 'eof', date: '2020-01-01', ordre: 36 }
    ] as ITitreEtape[]

    const result = titreEtapesSortAsc(etapes, arbreArmOct)
    expect(result[0].arbreTypeId).toEqual('vfd')
    expect(result[1].arbreTypeId).toEqual('mcr')
    expect(result[2].arbreTypeId).toEqual('eof')
  })
})
