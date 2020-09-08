import { ITitreTypeEtapeTypeRestriction } from '../../../../types'

const renPro: ITitreTypeEtapeTypeRestriction[] = [
  {
    condition: { etape: { typeId: 'mdp' } },
    obligatoireApres: [{ typeId: 'mfr' }],
    impossibleApres: [{ typeId: 'mcr' }]
  },
  {
    condition: { etape: { typeId: 'mod' } },
    obligatoireApres: [{ typeId: 'mdp' }]
  },
  {
    condition: { etape: { typeId: 'mod' } },
    impossibleApres: [{ typeId: 'mcr' }]
  },
  {
    condition: { etape: { typeId: 'mod' } },
    impossibleApres: [{ typeId: 'des' }]
  },
  {
    condition: { etape: { typeId: 'mcr' } },
    obligatoireApres: [{ typeId: 'mdp' }],
    impossibleApres: [{ typeId: 'mcr', statutId: 'fav' }]
  },
  {
    condition: { etape: { typeId: 'mco' } },
    obligatoireApres: [{ typeId: 'mcr' }],
    impossibleApres: [{ typeId: 'mcr', statutId: 'fav' }]
  },
  {
    condition: { etape: { typeId: 'rco' } },
    obligatoireApres: [{ typeId: 'mco' }],
    impossibleApres: [{ typeId: 'mcr', statutId: 'fav' }]
  },
  {
    condition: { etape: { typeId: 'eof' } },
    obligatoireApres: [{ typeId: 'mcr', statutId: 'fav' }],
    impossibleApres: [{ typeId: 'eof', statutId: 'fav' }]
  },
  {
    condition: { etape: { typeId: 'mif' } },
    obligatoireApres: [{ typeId: 'eof' }, { typeId: 'aof' }],
    impossibleApres: [{ typeId: 'aof', statutId: 'fav' }]
  },
  {
    condition: { etape: { typeId: 'rif' } },
    obligatoireApres: [{ typeId: 'mif' }],
    impossibleApres: [{ typeId: 'aof' }]
  },
  {
    condition: { etape: { typeId: 'aof' } },
    obligatoireApres: [{ typeId: 'eof' }],
    impossibleApres: [{ typeId: 'aof', statutId: 'fav' }]
  },
  {
    condition: { etape: { typeId: 'aco' } },
    obligatoireApres: [{ typeId: 'aof', statutId: 'fav' }]
  },
  {
    condition: { etape: { typeId: 'css' } },
    obligatoireApres: [{ typeId: 'mcr', statutId: 'def' }]
  },
  {
    condition: { etape: { typeId: 'css' } },
    impossibleApres: [{ typeId: 'mcr', statutId: 'fav' }]
  },
  {
    condition: { etape: { typeId: 'css' } },
    impossibleApres: [{ typeId: 'mno' }]
  },
  {
    condition: { etape: { typeId: 'des' } },
    obligatoireApres: [{ typeId: 'mdp' }],
    impossibleApres: [{ typeId: 'aco' }]
  },
  {
    condition: { etape: { typeId: 'des' } },
    obligatoireApres: [{ typeId: 'mdp' }],
    impossibleApres: [{ typeId: 'mno' }]
  },
  {
    condition: { etape: { typeId: 'des' } },
    obligatoireApres: [{ typeId: 'mdp' }],
    impossibleApres: [{ typeId: 'css' }]
  },
  {
    condition: { etape: { typeId: 'mno' } },
    obligatoireApres: [
      { typeId: 'aco' },
      { typeId: 'aof', statutId: 'def' },
      { typeId: 'css' }
    ]
  }
]

export default renPro
