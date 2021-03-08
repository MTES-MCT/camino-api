import { IDemarcheDefinitionRestrictions } from '../definitions'
import { etatInformationsGet } from '../etat-cycles'

// https://cacoo.com/diagrams/oWuHFa1Y8cCdCqaB/B1B05
const restrictionsArmOct: IDemarcheDefinitionRestrictions[] = [
  {
    etapeTypeId: 'mfr',
    justeApres: []
  },
  {
    etapeTypeId: 'mdp',
    separation: ['mcp'],
    justeApres: [[{ etapeTypeId: 'mfr', statutId: 'fai' }]]
  },
  {
    etapeTypeId: 'pfd',
    justeApres: [],
    avant: [[{ etapeTypeId: 'mcp' }]]
  },
  {
    etapeTypeId: 'mcb',
    apres: [[{ etapeTypeId: 'mdp' }]],
    avant: [[{ etapeTypeId: 'rde' }]],
    justeApres: [[]],
    final: false
  },
  { etapeTypeId: 'rcb', justeApres: [[{ etapeTypeId: 'mcb' }]] },
  { etapeTypeId: 'rde', justeApres: [[{ etapeTypeId: 'rcb' }], []] },
  {
    etapeTypeId: 'mcd',
    apres: [[{ etapeTypeId: 'mdp' }]],
    avant: [[{ etapeTypeId: 'dae' }]],
    justeApres: [[]],
    final: false
  },
  { etapeTypeId: 'rcd', justeApres: [[{ etapeTypeId: 'mcd' }]] },
  { etapeTypeId: 'dae', justeApres: [[{ etapeTypeId: 'rcd' }], []] },
  {
    etapeTypeId: 'mod',
    apres: [[{ etapeTypeId: 'mdp' }]],
    avant: [[{ etapeTypeId: 'sca' }]],
    justeApres: [[]],
    final: false
  },
  {
    etapeTypeId: 'mom',
    justeApres: [
      [{ etapeTypeId: 'rde', statutId: 'def' }],
      [{ etapeTypeId: 'dae', statutId: 'def' }]
    ]
  },
  {
    etapeTypeId: 'mcp',
    justeApres: [
      [
        { titre: { contenu: { arm: { mecanise: { valeur: true } } } } },
        { etapeTypeId: 'dae', statutId: 'fav' },
        { etapeTypeId: 'mdp' }
      ],
      [
        { titre: { contenu: { arm: { mecanise: { valeur: true } } } } },
        { etapeTypeId: 'dae', statutId: 'fav' },
        { etapeTypeId: 'pfd' }
      ],
      [
        { titre: { contenu: { arm: { mecanise: { valeur: false } } } } },
        { etapeTypeId: 'mdp' }
      ],
      [
        { titre: { contenu: { arm: { mecanise: { valeur: false } } } } },
        { etapeTypeId: 'pfd' }
      ],
      [{ etapeTypeId: 'mcr', statutId: 'def' }],
      [{ etapeTypeId: 'mom' }],
      [{ etapeTypeId: 'rcm' }]
    ]
  },
  {
    etapeTypeId: 'mcm',
    justeApres: [[{ etapeTypeId: 'mcp', statutId: 'def' }]]
  },
  {
    etapeTypeId: 'rcm',
    justeApres: [[{ etapeTypeId: 'mcm' }]]
  },
  {
    etapeTypeId: 'vfd',
    avant: [[{ etapeTypeId: 'vfd' }]],
    separation: ['mcr'],
    justeApres: [
      [{ etapeTypeId: 'mcp', statutId: 'fav' }],
      [{ etapeTypeId: 'des' }],
      [{ etapeTypeId: 'mnc' }]
    ]
  },
  {
    etapeTypeId: 'mim',
    avant: [[{ etapeTypeId: 'mcr' }]],
    justeApres: [[{ etapeTypeId: 'vfd' }], [{ etapeTypeId: 'rim' }]]
  },
  {
    etapeTypeId: 'rim',
    justeApres: [[{ etapeTypeId: 'mim' }]]
  },
  {
    etapeTypeId: 'mca',
    avant: [[{ etapeTypeId: 'mcr' }]],
    justeApres: [[{ etapeTypeId: 'vfd' }], [{ etapeTypeId: 'rca' }]]
  },
  {
    etapeTypeId: 'rca',
    justeApres: [[{ etapeTypeId: 'mca' }]]
  },
  {
    etapeTypeId: 'mcr',
    apres: [
      [{ etapeTypeId: 'vfd' }],
      [{ etapeTypeId: 'rim' }],
      [{ etapeTypeId: 'rca' }]
    ],
    separation: ['aof'],
    justeApres: [[{ etapeTypeId: 'rim' }], [{ etapeTypeId: 'vfd' }]]
  },
  ...etatInformationsGet('mid', 'rid', {
    etapeTypeId: 'edm',
    justeApres: [[{ etapeTypeId: 'mcr', statutId: 'fav' }]]
  }),
  {
    etapeTypeId: 'ede',
    justeApres: [[{ etapeTypeId: 'mcr', statutId: 'fav' }]]
  },
  ...etatInformationsGet('mio', 'rio', {
    etapeTypeId: 'eof',
    justeApres: [[{ etapeTypeId: 'mcr', statutId: 'fav' }]]
  }),
  {
    etapeTypeId: 'mia',
    justeApres: [[{ etapeTypeId: 'eof' }]]
  },
  {
    etapeTypeId: 'ria',
    justeApres: [[{ etapeTypeId: 'mia' }]]
  },
  {
    etapeTypeId: 'aof',
    justeApres: [
      [{ etapeTypeId: 'ria' }],
      [{ etapeTypeId: 'eof' }],
      [{ etapeTypeId: 'mcr', statutId: 'def' }]
    ]
  },
  {
    etapeTypeId: 'sca',
    justeApres: [
      [
        { etapeTypeId: 'aof' },
        { etapeTypeId: 'rde', statutId: 'fav' },
        {
          titre: {
            contenu: {
              arm: {
                franchissements: { valeur: 0, operation: 'NOT_EQUAL' }
              }
            }
          }
        }
      ],
      [
        { etapeTypeId: 'aof' },
        {
          titre: {
            contenu: {
              arm: {
                franchissements: { valeur: 0 }
              }
            }
          }
        }
      ],
      [{ etapeTypeId: 'mna' }],
      [{ etapeTypeId: 'rcs' }]
    ]
  },
  { etapeTypeId: 'aca', justeApres: [[{ etapeTypeId: 'sca' }]] },
  {
    etapeTypeId: 'mna',
    justeApres: [[{ etapeTypeId: 'aca', statutId: 'ajo' }]]
  },
  {
    etapeTypeId: 'mcs',
    justeApres: [[{ etapeTypeId: 'mna' }], [{ etapeTypeId: 'rcs' }]]
  },
  { etapeTypeId: 'rcs', justeApres: [[{ etapeTypeId: 'mcs' }]] },
  {
    etapeTypeId: 'mnb',
    justeApres: [
      [
        { etapeTypeId: 'aca', statutId: 'fav' },
        { titre: { contenu: { arm: { mecanise: { valeur: true } } } } }
      ]
    ]
  },
  {
    etapeTypeId: 'mnd',
    justeApres: [[{ etapeTypeId: 'aca', statutId: 'def' }]]
  },
  {
    etapeTypeId: 'pfc',
    justeApres: [[{ etapeTypeId: 'mnb' }]]
  },
  {
    etapeTypeId: 'vfc',
    avant: [[{ etapeTypeId: 'vfc' }]],
    justeApres: [
      [{ etapeTypeId: 'pfc' }],
      [
        { titre: { contenu: { arm: { mecanise: { valeur: true } } } } },
        { etapeTypeId: 'mnc' }
      ],
      [
        { titre: { contenu: { arm: { mecanise: { valeur: true } } } } },
        { etapeTypeId: 'des' }
      ]
    ]
  },
  {
    etapeTypeId: 'sco',
    justeApres: [
      [
        { titre: { contenu: { arm: { mecanise: { valeur: false } } } } },
        { etapeTypeId: 'aca', statutId: 'fav' }
      ],
      [
        { titre: { contenu: { arm: { mecanise: { valeur: true } } } } },
        { etapeTypeId: 'vfc' }
      ]
    ]
  },
  {
    etapeTypeId: 'mns',
    justeApres: [
      [
        { etapeTypeId: 'sco' },
        { titre: { contenu: { arm: { mecanise: { valeur: false } } } } }
      ]
    ]
  },
  {
    etapeTypeId: 'aco',
    justeApres: [
      [
        { etapeTypeId: 'sco' },
        { titre: { contenu: { arm: { mecanise: { valeur: true } } } } }
      ],
      [{ etapeTypeId: 'mnv' }],
      [{ etapeTypeId: 'mns' }]
    ]
  },
  { etapeTypeId: 'mnv', justeApres: [[{ etapeTypeId: 'aco' }]] },
  {
    etapeTypeId: 'css',
    justeApres: [],
    final: true,
    apres: [
      [{ etapeTypeId: 'mdp' }],
      [{ etapeTypeId: 'pfd' }],
      [{ etapeTypeId: 'rde' }],
      [{ etapeTypeId: 'dae' }]
    ],
    avant: [
      [{ etapeTypeId: 'sco' }],
      [{ etapeTypeId: 'des' }],
      [{ etapeTypeId: 'aca', statutId: 'def' }]
    ]
  },
  { etapeTypeId: 'mnc', justeApres: [[{ etapeTypeId: 'css' }]] },
  {
    etapeTypeId: 'des',
    justeApres: [],
    final: true,
    apres: [
      [{ etapeTypeId: 'mdp' }],
      [{ etapeTypeId: 'pfd' }],
      [{ etapeTypeId: 'rde' }],
      [{ etapeTypeId: 'dae' }]
    ],
    avant: [
      [{ etapeTypeId: 'sco' }],
      [{ etapeTypeId: 'aca', statutId: 'def' }],
      [{ etapeTypeId: 'css' }]
    ]
  }
]

export { restrictionsArmOct }
