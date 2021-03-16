import {
  etapesSuivantesEnAttenteGet,
  titreEtapeTypeIdRestrictionsFind
} from './titre-etape-etat-validate'
import { restrictionsArmRet } from '../rules-demarches/arm/ret'
import { ITitreEtape } from '../../types'
import { etatInformationsGet } from '../rules-demarches/etat-cycles'

describe('teste etapesSuivantesEnAttenteGet', () => {
  test('retourne la seule étape déjà effectuée', () => {
    const etapes = [{ typeId: 'ide' }] as ITitreEtape[]
    const etapesEnAttente = etapesSuivantesEnAttenteGet(
      etapes,
      etapes,
      [],
      restrictionsArmRet
    )
    expect(etapesEnAttente).toHaveLength(1)
    expect(etapesEnAttente[0]).toEqual({ typeId: 'ide' })
  })

  test('retourne la dernière étape d’un arbre avec un seul acteur', () => {
    const etapes = [
      { typeId: 'ide' },
      { typeId: 'mni' },
      { typeId: 'css' }
    ] as ITitreEtape[]
    const etapesEnAttente = etapesSuivantesEnAttenteGet(
      etapes,
      etapes,
      [],
      restrictionsArmRet
    )
    expect(etapesEnAttente).toHaveLength(1)
    expect(etapesEnAttente[0]).toEqual({ typeId: 'css' })
  })

  test('retourne les 2 dernières étapes des chemins parralèles', () => {
    const etapes = [{ typeId: 'ide1' }, { typeId: 'ide2' }] as ITitreEtape[]
    const etapesEnAttente = etapesSuivantesEnAttenteGet(etapes, etapes, [], {
      ide1: { justeApres: [] },
      ide2: { justeApres: [] },
      mno: {
        justeApres: [[{ etapeTypeId: 'ide1' }, { etapeTypeId: 'ide2' }]]
      }
    })
    expect(etapesEnAttente).toHaveLength(2)
    expect(etapesEnAttente[0]).toEqual({ typeId: 'ide1' })
    expect(etapesEnAttente[1]).toEqual({ typeId: 'ide2' })
  })

  test('retourne la dernière étape après la fusion de 2 chemins parralèles', () => {
    const etapes = [
      { typeId: 'ide1' },
      { typeId: 'ide2' },
      { typeId: 'mno' }
    ] as ITitreEtape[]
    const etapesEnAttente = etapesSuivantesEnAttenteGet(etapes, etapes, [], {
      ide1: { justeApres: [] },
      ide2: { justeApres: [] },
      mno: {
        justeApres: [[{ etapeTypeId: 'ide1' }, { etapeTypeId: 'ide2' }]]
      }
    })
    expect(etapesEnAttente).toHaveLength(1)
    expect(etapesEnAttente[0]).toEqual({ typeId: 'mno' })
  })
  test('retourne l’étape sur le premier chemin et l’étape sur le chemin commun', () => {
    const etapes = [{ typeId: 'ide' }, { typeId: 'mno1' }] as ITitreEtape[]
    const etapesEnAttente = etapesSuivantesEnAttenteGet(etapes, etapes, [], {
      ide: { separation: ['css'], justeApres: [] },
      mno1: {
        justeApres: [[{ etapeTypeId: 'ide' }]]
      },
      mno2: {
        justeApres: [[{ etapeTypeId: 'ide' }]]
      },
      css: {
        justeApres: [[{ etapeTypeId: 'mno1' }, { etapeTypeId: 'mno2' }]]
      }
    })
    expect(etapesEnAttente).toHaveLength(2)
    expect(etapesEnAttente[0]).toEqual({ typeId: 'ide' })
    expect(etapesEnAttente[1]).toEqual({ typeId: 'mno1' })
  })
  test('retourne l’étape sur la dernière étape sur le chemin commun', () => {
    const etapes = [
      { typeId: 'ide' },
      { typeId: 'mno1' },
      { typeId: 'mno2' },
      { typeId: 'css' }
    ] as ITitreEtape[]
    const etapesEnAttente = etapesSuivantesEnAttenteGet(etapes, etapes, [], {
      ide: { separation: ['css'], justeApres: [] },
      mno1: {
        justeApres: [[{ etapeTypeId: 'ide' }]]
      },
      mno2: {
        justeApres: [[{ etapeTypeId: 'ide' }]]
      },
      css: {
        justeApres: [[{ etapeTypeId: 'mno1' }, { etapeTypeId: 'mno2' }]]
      }
    })
    expect(etapesEnAttente).toHaveLength(1)
    expect(etapesEnAttente[0]).toEqual({ typeId: 'css' })
  })
  test('retourne seulement l’étape "rif" dés qu’une demande d’info a commencé', () => {
    const etapes = [{ typeId: 'vfd' }, { typeId: 'mif-mcr' }] as ITitreEtape[]
    const etapesEnAttente = etapesSuivantesEnAttenteGet(etapes, etapes, [], {
      vfd: { justeApres: [] },
      ...etatInformationsGet('mif-mcr', 'rif-mcr', {
        etapeTypeId: 'mcr',
        separation: ['eof'],
        justeApres: [[{ etapeTypeId: 'vfd' }]]
      })
    })
    expect(etapesEnAttente).toHaveLength(1)
    expect(etapesEnAttente[0]).toEqual({ typeId: 'mif-mcr' })
  })

  test('retourne la dernière étape sur le chemin commun à la fin du démarche', () => {
    const etapes = [{ typeId: 'dex' }, { typeId: 'mno1' }] as ITitreEtape[]
    const etapesEnAttente = etapesSuivantesEnAttenteGet(etapes, etapes, [], {
      dex: { justeApres: [], separation: [] },
      mno1: {
        justeApres: [[{ etapeTypeId: 'dex' }]]
      },
      mno2: {
        justeApres: [[{ etapeTypeId: 'dex' }]]
      },
      mno3: {
        justeApres: [[{ etapeTypeId: 'dex' }]]
      }
    })
    expect(etapesEnAttente).toHaveLength(2)
    expect(etapesEnAttente[0]).toEqual({ typeId: 'dex' })
  })
})

describe('teste titreEtapeTypeIdRestrictionsFind', () => {
  test('émet une erreur si l’étape est inconnue', () => {
    expect(() =>
      titreEtapeTypeIdRestrictionsFind(
        { dex: { justeApres: [], separation: [] } },
        'aaa'
      )
    ).toThrowError()
  })
})
