import { ITitreTypeEtapeTypeRestriction } from '../../../../types'

const oct: ITitreTypeEtapeTypeRestriction[] = [
  {
    condition: { etape: { typeId: 'des' } },
    contraintes: [
      {
        obligatoireApres: [
          { typeId: 'mdp' },
          { typeId: 'pfd' },
          { typeId: 'rde' },
          { typeId: 'dae' }
        ],
        impossibleApres: [{ typeId: 'sca' }]
      }
    ]
  },

  {
    condition: { etape: { typeId: 'mdp' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'mfr' }],
        impossibleApres: [{ typeId: 'mcp' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'dae' } },
    contraintes: [
      {
        impossibleApres: [{ typeId: 'mcp' }]
      }
    ]
  },
  {
    condition: {
      etape: { typeId: 'rde' },
      titre: {
        contenu: {
          arm: {
            franchissements: { valeur: 0, operation: 'NOT_EQUAL' }
          }
        }
      }
    },
    contraintes: [
      {
        impossibleApres: [{ typeId: 'sca' }]
      }
    ]
  },
  {
    condition: {
      etape: { typeId: 'rde' },
      titre: {
        contenu: {
          arm: {
            franchissements: { valeur: 0 }
          }
        }
      }
    },
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
        obligatoireApres: [
          { typeId: 'mdp' },
          { typeId: 'rde', statutId: 'def' },
          { typeId: 'dae' }
        ],
        impossibleApres: [{ typeId: 'sca' }]
      }
    ]
  },

  {
    condition: { etape: { typeId: 'pfd' } },
    contraintes: [
      {
        impossibleApres: [{ typeId: 'mcp' }]
      }
    ]
  },

  {
    condition: { etape: { typeId: 'mcp' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'mdp' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'mcp' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'pfd' }]
      }
    ]
  },

  // titres mécanisés
  {
    condition: {
      titre: {
        contenu: { arm: { mecanise: { valeur: true } } }
      },
      etape: { typeId: 'mcp' }
    },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'dae' }]
      }
    ]
  },

  {
    condition: { etape: { typeId: 'mcp' } },
    contraintes: [
      {
        impossibleApres: [{ typeId: 'mcr', statutId: 'fav' }]
      }
    ]
  },

  // cycle de compléments de la complétude
  {
    condition: { etape: { typeId: 'mco' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'mcp' }, { typeId: 'rde' }],
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
    condition: { etape: { typeId: 'css' } },
    contraintes: [
      {
        obligatoireApres: [
          { typeId: 'mdp' },
          { typeId: 'pfd' },
          { typeId: 'rde' },
          { typeId: 'dae' }
        ],
        impossibleApres: [
          { typeId: 'sco' },
          { typeId: 'des' },
          { typeId: 'aca', statutId: 'def' }
        ]
      }
    ]
  },

  {
    condition: { etape: { typeId: 'vfd' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'mcp', statutId: 'fav' }],
        impossibleApres: [{ typeId: 'mcr', statutId: 'fav' }]
      }
    ]
  },

  {
    condition: { etape: { typeId: 'mcr' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'vfd' }],
        impossibleApres: [{ typeId: 'mcr', statutId: 'fav' }]
      }
    ]
  },

  // cycle d'informations
  {
    condition: { etape: { typeId: 'mif' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'mcr' }],
        impossibleApres: [{ typeId: 'sca' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'rif' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'mif' }],
        impossibleApres: [{ typeId: 'sca' }]
      }
    ]
  },

  {
    condition: { etape: { typeId: 'edm' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'mcr', statutId: 'fav' }],
        impossibleApres: [{ typeId: 'aof' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'ede' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'mcr', statutId: 'fav' }],
        impossibleApres: [{ typeId: 'aof' }]
      }
    ]
  },

  {
    condition: { etape: { typeId: 'eof' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'mcr', statutId: 'fav' }],
        impossibleApres: [{ typeId: 'aof' }]
      }
    ]
  },

  {
    condition: { etape: { typeId: 'aof' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'eof' }],
        impossibleApres: [{ typeId: 'aof' }]
      }
    ]
  },

  {
    condition: { etape: { typeId: 'sca' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'aof' }],
        impossibleApres: [{ typeId: 'aca' }]
      }
    ]
  },

  // titres avec franchissement d'eau
  {
    condition: {
      etape: { typeId: 'sca' },
      titre: {
        contenu: {
          arm: {
            franchissements: { valeur: 0, operation: 'NOT_EQUAL' }
          }
        }
      }
    },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'rde', statutId: 'fav' }],
        impossibleApres: [{ typeId: 'aca' }]
      }
    ]
  },

  {
    condition: {
      etape: { typeId: 'sca' },
      titre: {
        contenu: {
          arm: {
            franchissements: { valeur: 0, operation: 'NOT_EQUAL' }
          }
        }
      }
    },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'aof' }],
        impossibleApres: [{ typeId: 'aca' }]
      }
    ]
  },

  {
    condition: { etape: { typeId: 'aca' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'sca' }],
        impossibleApres: [{ typeId: 'css' }, { typeId: 'des' }]
      }
    ]
  },

  {
    condition: { etape: { typeId: 'mno' } },
    contraintes: [
      {
        obligatoireApres: [
          { typeId: 'aca' },
          { typeId: 'css' },
          { typeId: 'aco' }
        ]
      }
    ]
  },

  {
    condition: {
      titre: { contenu: { arm: { mecanise: { valeur: false } } } },
      etape: { typeId: 'pfc' }
    },
    contraintes: [
      {
        impossible: true
      }
    ]
  },

  // paiement des frais de dossier titre mécanisé
  {
    condition: {
      titre: { contenu: { arm: { mecanise: { valeur: true } } } },
      etape: { typeId: 'pfc' }
    },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'aca', statutId: 'fav' }]
      }
    ]
  },
  {
    condition: {
      titre: { contenu: { arm: { mecanise: { valeur: true } } } },
      etape: { typeId: 'pfc' }
    },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'mno' }]
      }
    ]
  },
  {
    condition: { etape: { typeId: 'pfc' } },
    contraintes: [
      {
        impossibleApres: [{ typeId: 'vfc' }]
      }
    ]
  },
  // validation des frais de dossier titre mécanisé
  {
    condition: { etape: { typeId: 'vfc' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'pfc' }],
        impossibleApres: [{ typeId: 'sco' }]
      }
    ]
  },
  {
    condition: {
      titre: { contenu: { arm: { mecanise: { valeur: true } } } },
      etape: { typeId: 'sco' }
    },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'vfc' }]
      }
    ]
  },

  {
    condition: {
      titre: { contenu: { arm: { mecanise: { valeur: false } } } },
      etape: { typeId: 'sco' }
    },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'aca', statutId: 'fav' }]
      }
    ]
  },
  {
    condition: {
      titre: { contenu: { arm: { mecanise: { valeur: false } } } },
      etape: { typeId: 'sco' }
    },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'mno' }]
      }
    ]
  },

  {
    condition: { etape: { typeId: 'sco' } },
    contraintes: [
      {
        impossibleApres: [{ typeId: 'aco' }]
      }
    ]
  },

  {
    condition: { etape: { typeId: 'aco' } },
    contraintes: [
      {
        obligatoireApres: [{ typeId: 'sco' }]
      }
    ]
  }
]

export default oct
