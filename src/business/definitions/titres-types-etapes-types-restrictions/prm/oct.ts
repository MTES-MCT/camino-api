import { ITitreTypeEtapeTypeRestriction } from '../../../../types'

const oct: ITitreTypeEtapeTypeRestriction[] = [
  {
    condition: { etape: { typeId: 'mdp' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'mfr' }],
        impossibleApres: [{ typeId: 'spp' }]
      }
    ]
  },

  {
    condition: { etape: { typeId: 'des' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'mdp' }],
        impossibleApres: [{ typeId: 'dex' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'dim', statutId: 'rej' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'mdp' }],
        impossibleApres: [{ typeId: 'dex' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'dim', statutId: 'acc' } },
    contraintes: [
      {
        impossible: true
      }
    ]
  },

  {
    condition: { etape: { typeId: 'mod' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'mdp' }],
        impossibleApres: [{ typeId: 'sas' }]
      }
    ]
  },

  {
    condition: { etape: { typeId: 'mif' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'mdp' }],
        impossibleApres: [{ typeId: 'sas' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'rif' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'mif' }],
        impossibleApres: [{ typeId: 'sas' }]
      }
    ]
  },

  {
    condition: { etape: { typeId: 'spp' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'mdp' }],
        impossibleApres: [{ typeId: 'mcr' }]
      }
    ]
  },

  {
    condition: { etape: { typeId: 'mcr' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'spp' }],
        impossibleApres: [
          { typeId: 'ssr' },
          { typeId: 'scl' },
          { typeId: 'ppu' }
        ]
      }
    ]
  },

  {
    condition: { etape: { typeId: 'mco' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'mcr', statutId: 'def' }],
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
    condition: { etape: { typeId: 'anf' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'mcr' }],
        impossibleApres: [
          { typeId: 'mec' },
          { typeId: 'ssr' },
          { typeId: 'scl' },
          { typeId: 'ppu' }
        ]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'mec' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'anf' }],
        impossibleApres: [{ typeId: 'ssr' }]
      }
    ]
  },

  {
    condition: { etape: { typeId: 'ppu' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'mcr' }],
        impossibleApres: [{ typeId: 'scg' }]
      }
    ]
  },

  {
    condition: { etape: { typeId: 'ssr' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'mcr' }],
        impossibleApres: [{ typeId: 'apd' }]
      }
    ]
  },

  {
    condition: { etape: { typeId: 'apl' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'ssr' }],
        impossibleApres: [{ typeId: 'apd' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'apm' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'ssr' }],
        impossibleApres: [{ typeId: 'apd' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'pnr' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'ssr' }],
        impossibleApres: [{ typeId: 'apd' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'apn' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'ssr' }],
        impossibleApres: [{ typeId: 'apd' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'aof' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'ssr' }],
        impossibleApres: [{ typeId: 'apd' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'aop' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'ssr' }],
        impossibleApres: [{ typeId: 'apd' }]
      }
    ]
  },

  {
    condition: { etape: { typeId: 'scl' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'mcr' }],
        impossibleApres: [{ typeId: 'apd' }]
      }
    ]
  },

  {
    condition: { etape: { typeId: 'ama' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'scl' }],
        impossibleApres: [{ typeId: 'apd' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'aep' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'scl' }],
        impossibleApres: [{ typeId: 'apd' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'acl' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'scl' }],
        impossibleApres: [{ typeId: 'apd' }]
      }
    ]
  },

  {
    condition: { etape: { typeId: 'spo' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'ssr' }],
        impossibleApres: [{ typeId: 'apo' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'apo' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'spo' }],
        impossibleApres: [{ typeId: 'apd' }]
      }
    ]
  },

  {
    condition: { etape: { typeId: 'apd' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'ssr' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'apd' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'scl' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'apd' } },
    contraintes: [
      {
        impossibleApres: [{ typeId: 'app' }]
      }
    ]
  },

  {
    condition: { etape: { typeId: 'app' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'apd' }],
        impossibleApres: [{ typeId: 'scg' }]
      }
    ]
  },

  {
    condition: { etape: { typeId: 'scg' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'app' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'scg' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'ppu' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'scg' } },
    contraintes: [
      {
        impossibleApres: [{ typeId: 'rcg' }]
      }
    ]
  },

  {
    condition: { etape: { typeId: 'rcg' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'scg' }],
        impossibleApres: [{ typeId: 'acg' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'acg' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'rcg' }],
        impossibleApres: [{ typeId: 'sas' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'sas' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'acg' }],
        impossibleApres: [{ typeId: 'dex' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'dex' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'sas' }],
        impossibleApres: [{ typeId: 'des' }]
      }
    ]
  },

  {
    condition: { etape: { typeId: 'dpu', statutId: 'acc' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'dex', statutId: 'acc' }],
        impossibleApres: [{ typeId: 'des' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'dpu', statutId: 'rej' } },
    contraintes: [
      {
        impossible: true
      }
    ]
  },

  {
    condition: { etape: { typeId: 'npp' } },
    contraintes: [
      {
        obligatoireApres: [
          { typeId: 'dpu', statutId: 'fav' },
          { typeId: 'dex', statutId: 'rej' }
        ]
      }
    ]
  },

  {
    condition: { etape: { typeId: 'rpu' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'npp' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'rpu' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'dpu', statutId: 'fav' }]
      }
    ]
  },

  {
    condition: { etape: { typeId: 'ncl' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'npp' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'ncl' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'dpu', statutId: 'fav' }]
      }
    ]
  },

  {
    condition: { etape: { typeId: 'mno' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'npp' }]
      }
    ]
  },

  {
    condition: { etape: { typeId: 'abd' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'dex' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'rtd' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'dex' }]
      }
    ]
  },

  {
    condition: { etape: { typeId: 'and' } },
    contraintes: [
      {
        obligatoireApres: [
          { typeId: 'dex' },
          { typeId: 'dim', statutId: 'rej' }
        ]
      }
    ]
  }
]

export default oct
