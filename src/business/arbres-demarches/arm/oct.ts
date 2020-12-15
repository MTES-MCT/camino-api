import { IArbreEtape } from '../arbres-demarches'
import { arbreComplementsGet, arbreInformationsGet } from '../arbres-annexes'

// https://cacoo.com/diagrams/oWuHFa1Y8cCdCqaB/B1B05
const arbreArmOct: IArbreEtape[] = [
  {
    arbreTypeId: 'mfr',
    justeApres: []
  },
  {
    arbreTypeId: 'mdp',
    separation: ['mcp'],
    justeApres: [[{ arbreTypeId: 'mfr' }]]
  },
  {
    arbreTypeId: 'pfd',
    justeApres: [],
    avant: [[{ arbreTypeId: 'mcp' }]]
  },
  ...arbreComplementsGet({
    arbreTypeId: 'rde',
    separation: ['sca'],
    justeApres: [[]]
  }),
  ...arbreComplementsGet({
    arbreTypeId: 'dae',
    separation: ['mcp'],
    justeApres: [[]]
  }),
  {
    arbreTypeId: 'mod',
    justeApres: [],
    apres: [
      [{ arbreTypeId: 'mdp' }],
      [{ arbreTypeId: 'rde', statutId: 'def' }],
      [{ arbreTypeId: 'dae', statutId: 'def' }]
    ],
    avant: [[{ arbreTypeId: 'sca' }]]
  },
  {
    arbreTypeId: 'mcp',
    justeApres: [
      [
        { titre: { contenu: { arm: { mecanise: { valeur: true } } } } },
        { arbreTypeId: 'dae', statutId: 'fav' },
        { arbreTypeId: 'mdp' }
      ],
      [
        { titre: { contenu: { arm: { mecanise: { valeur: true } } } } },
        { arbreTypeId: 'dae', statutId: 'fav' },
        { arbreTypeId: 'pfd' }
      ],
      [
        { titre: { contenu: { arm: { mecanise: { valeur: false } } } } },
        { arbreTypeId: 'mdp' }
      ],
      [
        { titre: { contenu: { arm: { mecanise: { valeur: false } } } } },
        { arbreTypeId: 'pfd' }
      ],
      [{ arbreTypeId: 'mcr', statutId: 'def' }],
      [{ arbreTypeId: 'mod' }],
      [{ arbreTypeId: 'rco-mcp' }]
    ]
  },
  {
    arbreTypeId: 'mco-mcp',
    justeApres: [[{ arbreTypeId: 'mcp', statutId: 'def' }]]
  },
  {
    arbreTypeId: 'rco-mcp',
    justeApres: [[{ arbreTypeId: 'mco-mcp' }]]
  },
  {
    arbreTypeId: 'vfd',
    avant: [[{ arbreTypeId: 'vfd' }]],
    justeApres: [
      [{ arbreTypeId: 'mcp', statutId: 'fav' }],
      [{ arbreTypeId: 'des' }],
      [{ arbreTypeId: 'mno-css' }]
    ]
  },
  {
    arbreTypeId: 'mif-mcr',
    avant: [[{ arbreTypeId: 'mcr', statutId: 'fav' }]],
    apres: [[{ arbreTypeId: 'vfd' }]],
    justeApres: [
      [{ arbreTypeId: 'vfd' }],
      [{ arbreTypeId: 'mcp', statutId: 'fav' }]
    ]
  },
  {
    arbreTypeId: 'rif-mcr',
    justeApres: [[{ arbreTypeId: 'mif-mcr' }]]
  },
  {
    arbreTypeId: 'mcr',
    apres: [[{ arbreTypeId: 'vfd' }]],
    avant: [[{ arbreTypeId: 'mcr', statutId: 'fav' }]],
    separation: ['aof'],
    justeApres: [
      [{ arbreTypeId: 'rif-mcr' }],
      [{ arbreTypeId: 'vfd' }],
      [{ arbreTypeId: 'mcp', statutId: 'fav' }]
    ]
  },
  ...arbreInformationsGet({
    arbreTypeId: 'edm',
    justeApres: [[{ arbreTypeId: 'mcr', statutId: 'fav' }]]
  }),
  {
    arbreTypeId: 'ede',
    justeApres: [[{ arbreTypeId: 'mcr', statutId: 'fav' }]]
  },
  ...arbreInformationsGet({
    arbreTypeId: 'eof',
    justeApres: [[{ arbreTypeId: 'mcr', statutId: 'fav' }]]
  }),
  {
    arbreTypeId: 'mif-aof',
    justeApres: [[{ arbreTypeId: 'eof' }]]
  },
  {
    arbreTypeId: 'rif-aof',
    justeApres: [[{ arbreTypeId: 'mif-aof' }]]
  },
  {
    arbreTypeId: 'aof',
    justeApres: [[{ arbreTypeId: 'rif-aof' }], [{ arbreTypeId: 'eof' }]]
  },
  {
    arbreTypeId: 'sca',
    justeApres: [
      [
        { arbreTypeId: 'aof' },
        { arbreTypeId: 'rde', statutId: 'fav' },
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
        { arbreTypeId: 'aof' },
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
      [{ arbreTypeId: 'mno-sca' }],
      [{ arbreTypeId: 'rco-sca' }]
    ]
  },
  { arbreTypeId: 'aca', justeApres: [[{ arbreTypeId: 'sca' }]] },
  {
    arbreTypeId: 'mno-sca',
    justeApres: [[{ arbreTypeId: 'aca', statutId: 'ajo' }]]
  },
  {
    arbreTypeId: 'mco-sca',
    justeApres: [[{ arbreTypeId: 'mno-sca' }], [{ arbreTypeId: 'rco-sca' }]]
  },
  { arbreTypeId: 'rco-sca', justeApres: [[{ arbreTypeId: 'mco-sca' }]] },
  {
    arbreTypeId: 'mno-aca',
    justeApres: [
      [
        { arbreTypeId: 'aca', statutId: 'fav' },
        { titre: { contenu: { arm: { mecanise: { valeur: true } } } } }
      ]
    ]
  },
  {
    arbreTypeId: 'mno-rej',
    justeApres: [[{ arbreTypeId: 'aca', statutId: 'def' }]]
  },
  {
    arbreTypeId: 'pfc',
    justeApres: [[{ arbreTypeId: 'mno-aca' }]]
  },
  {
    arbreTypeId: 'vfc',
    avant: [[{ arbreTypeId: 'vfc' }]],
    justeApres: [
      [{ arbreTypeId: 'pfc' }],
      [
        { titre: { contenu: { arm: { mecanise: { valeur: true } } } } },
        { arbreTypeId: 'mno-css' }
      ],
      [
        { titre: { contenu: { arm: { mecanise: { valeur: true } } } } },
        { arbreTypeId: 'des' }
      ]
    ]
  },
  {
    arbreTypeId: 'sco',
    justeApres: [
      [
        { titre: { contenu: { arm: { mecanise: { valeur: false } } } } },
        { arbreTypeId: 'aca', statutId: 'fav' }
      ],
      [
        { titre: { contenu: { arm: { mecanise: { valeur: true } } } } },
        { arbreTypeId: 'vfc' }
      ]
    ]
  },
  {
    arbreTypeId: 'mno-sco',
    justeApres: [
      [
        { arbreTypeId: 'sco' },
        { titre: { contenu: { arm: { mecanise: { valeur: false } } } } }
      ]
    ]
  },
  {
    arbreTypeId: 'aco',
    justeApres: [
      [
        { arbreTypeId: 'sco' },
        { titre: { contenu: { arm: { mecanise: { valeur: true } } } } }
      ],
      [{ arbreTypeId: 'mno-aco' }],
      [{ arbreTypeId: 'mno-sco' }]
    ]
  },
  { arbreTypeId: 'mno-aco', justeApres: [[{ arbreTypeId: 'aco' }]] },
  {
    arbreTypeId: 'css',
    justeApres: [],
    apres: [
      [{ arbreTypeId: 'mdp' }],
      [{ arbreTypeId: 'pfd' }],
      [{ arbreTypeId: 'rde' }],
      [{ arbreTypeId: 'dae' }]
    ],
    avant: [
      [{ arbreTypeId: 'sco' }],
      [{ arbreTypeId: 'des' }],
      [{ arbreTypeId: 'aca', statutId: 'def' }]
    ]
  },
  { arbreTypeId: 'mno-css', justeApres: [[{ arbreTypeId: 'css' }]] },
  {
    arbreTypeId: 'des',
    justeApres: [],
    apres: [
      [{ arbreTypeId: 'mdp' }],
      [{ arbreTypeId: 'pfd' }],
      [{ arbreTypeId: 'rde' }],
      [{ arbreTypeId: 'dae' }]
    ],
    avant: [
      [{ arbreTypeId: 'sco' }],
      [{ arbreTypeId: 'aca', statutId: 'def' }],
      [{ arbreTypeId: 'css' }]
    ]
  }
]

export { arbreArmOct }
