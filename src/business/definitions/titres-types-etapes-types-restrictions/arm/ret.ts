import { ITitreTypeEtapeTypeRestriction } from '../../../../types'

const ret: ITitreTypeEtapeTypeRestriction[] = [
  {
    condition: { etape: { typeId: 'ide' } },
    contraintes: [{ impossibleApres: [{ typeId: 'ide' }] }]
  },
  {
    condition: { etape: { typeId: 'mno' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'ide' }],
        impossibleApres: [{ typeId: 'mno' }]
      },
      {
        obligatoireApres: [
          { typeId: 'aco' },
          { typeId: 'css' },
          { typeId: 'aof', statutId: 'def' }
        ]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'rif' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'mno' }, { typeId: 'mif' }],
        impossibleApres: [
          { typeId: 'eof' },
          { typeId: 'aof' },
          { typeId: 'css' }
        ]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'eof' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'rif' }],
        impossibleApres: [{ typeId: 'eof' }, { typeId: 'css' }]
      }
    ]
  },
  // cycle d’informations
  {
    condition: { etape: { typeId: 'mif' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'rif' }],
        impossibleApres: [{ typeId: 'eof' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'aof' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'mno' }],
        impossibleApres: [{ typeId: 'rif' }]
      },
      {
        obligatoireApres: [{ typeId: 'eof' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'aof' } },
    contraintes: [
      {
        impossibleApres: [{ typeId: 'aof' }, { typeId: 'css' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'aco' } },
    contraintes: [{ obligatoireApres: [{ typeId: 'aof', statutId: 'fav' }] }]
  },
  {
    condition: { etape: { typeId: 'css' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'mno' }],
        impossibleApres: [{ typeId: 'aof' }, { typeId: 'css' }]
      }
    ]
  }
]

export default ret
