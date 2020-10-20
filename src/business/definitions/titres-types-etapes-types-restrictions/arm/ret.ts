import { ITitreTypeEtapeTypeRestriction } from '../../../../types'

const ret: ITitreTypeEtapeTypeRestriction[] = [
  {
    condition: { etape: { typeId: 'ide' } },
    impossibleApres: [{ typeId: 'ide' }]
  },
  {
    condition: { etape: { typeId: 'mno' } },
    obligatoireApres: [
      { typeId: 'ide' },
      { typeId: 'aco' },
      { typeId: 'css' },
      { typeId: 'aof', statutId: 'def' }
    ]
  },
  {
    condition: { etape: { typeId: 'rif' } },
    obligatoireApres: [{ typeId: 'mno' }, { typeId: 'mif' }],
    impossibleApres: [{ typeId: 'eof' }, { typeId: 'aof' }, { typeId: 'css' }]
  },
  {
    condition: { etape: { typeId: 'eof' } },
    obligatoireApres: [{ typeId: 'rif' }],
    impossibleApres: [{ typeId: 'eof' }, { typeId: 'css' }]
  },
  // cycle d’informations
  {
    condition: { etape: { typeId: 'mif' } },
    obligatoireApres: [{ typeId: 'rif' }],
    impossibleApres: [{ typeId: 'eof' }]
  },
  {
    condition: { etape: { typeId: 'aof' } },
    obligatoireApres: [{ typeId: 'eof' }, { typeId: 'mno' }],
    impossibleApres: [{ typeId: 'aof' }, { typeId: 'css' }]
  },
  {
    condition: { etape: { typeId: 'aco' } },
    obligatoireApres: [{ typeId: 'aof', statutId: 'fav' }]
  },
  {
    condition: { etape: { typeId: 'css' } },
    obligatoireApres: [{ typeId: 'mno' }],
    impossibleApres: [{ typeId: 'aof' }]
  }
]

export default ret
