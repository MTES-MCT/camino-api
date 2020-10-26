import { ITitreTypeEtapeTypeRestriction } from '../../../../types'

const renPro: ITitreTypeEtapeTypeRestriction[] = [
  {
    condition: { etape: { typeId: 'mdp' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'mfr' }],
        impossibleApres: [{ typeId: 'mcr' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'mod' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'mdp' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'mod' } },
    contraintes: [
      {
        impossibleApres: [{ typeId: 'mcr' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'mod' } },
    contraintes: [
      {
        impossibleApres: [{ typeId: 'des' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'mcr' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'mdp' }],
        impossibleApres: [{ typeId: 'mcr', statutId: 'fav' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'mco' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'mcr' }],
        impossibleApres: [{ typeId: 'mcr', statutId: 'fav' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'rco' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'mco' }],
        impossibleApres: [{ typeId: 'mcr', statutId: 'fav' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'eof' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'mcr', statutId: 'fav' }],
        impossibleApres: [{ typeId: 'eof', statutId: 'fav' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'mif' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'eof' }, { typeId: 'aof' }],
        impossibleApres: [{ typeId: 'aof', statutId: 'fav' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'rif' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'mif' }],
        impossibleApres: [{ typeId: 'aof' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'aof' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'eof' }],
        impossibleApres: [{ typeId: 'aof', statutId: 'fav' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'aco' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'aof', statutId: 'fav' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'css' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'mcr', statutId: 'def' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'css' } },
    contraintes: [
      {
        impossibleApres: [{ typeId: 'mcr', statutId: 'fav' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'css' } },
    contraintes: [
      {
        impossibleApres: [{ typeId: 'mno' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'des' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'mdp' }],
        impossibleApres: [{ typeId: 'aco' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'des' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'mdp' }],
        impossibleApres: [{ typeId: 'mno' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'des' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'mdp' }],
        impossibleApres: [{ typeId: 'css' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'mno' } },
    contraintes: [
      {
        obligatoireApres: [
          { typeId: 'aco' },
          { typeId: 'aof', statutId: 'def' },
          { typeId: 'css' }
        ]
      }
    ]
  }
]

export default renPro
