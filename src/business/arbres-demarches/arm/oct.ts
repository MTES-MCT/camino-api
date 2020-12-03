import { IArbreEtape } from '../arbres-demarches'
import { arbreComplementsGet, arbreInformationsGet } from '../arbres-annexes'

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
    justeApres: [
      [{ arbreTypeId: 'mdp' }],
      [{ arbreTypeId: 'rde', statutId: 'def' }],
      [{ arbreTypeId: 'dae', statutId: 'def' }]
    ]
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
    justeApres: [[{ arbreTypeId: 'mcp', statutId: 'fav' }]]
  },
  ...arbreInformationsGet(
    {
      arbreTypeId: 'mcr',
      separation: ['aof', 'mcp'],
      justeApres: [[{ arbreTypeId: 'vfd' }]]
    },
    false
  ),
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
      [{ arbreTypeId: 'aca' }]
    ]
  },
  { arbreTypeId: 'aca', justeApres: [[{ arbreTypeId: 'sca' }]] },
  {
    arbreTypeId: 'mno-aca',
    separation: ['sco'],
    justeApres: [[{ arbreTypeId: 'aca', statutId: 'fav' }]]
  },
  {
    arbreTypeId: 'mno-rej',
    justeApres: [[{ arbreTypeId: 'aca', statutId: 'def' }]]
  },
  {
    arbreTypeId: 'pfc',
    justeApres: [
      [
        { titre: { contenu: { arm: { mecanise: { valeur: true } } } } },
        { arbreTypeId: 'mno-aca' }
      ]
    ]
  },
  {
    arbreTypeId: 'vfc',
    justeApres: [
      [
        { titre: { contenu: { arm: { mecanise: { valeur: true } } } } },
        { arbreTypeId: 'pfc' }
      ]
    ]
  },
  {
    arbreTypeId: 'sco',
    justeApres: [
      [
        { titre: { contenu: { arm: { mecanise: { valeur: false } } } } },
        { arbreTypeId: 'mno-aca' }
      ],
      [
        { titre: { contenu: { arm: { mecanise: { valeur: true } } } } },
        { arbreTypeId: 'mno-aca' },
        { arbreTypeId: 'vfc' }
      ]
    ]
  },
  {
    arbreTypeId: 'aco',
    justeApres: [[{ arbreTypeId: 'sco' }], [{ arbreTypeId: 'mno-aco' }]]
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
      [
        { arbreTypeId: 'sco' },
        { arbreTypeId: 'des' },
        { arbreTypeId: 'aca', statutId: 'def' },
        { arbreTypeId: 'css' }
      ]
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
      [
        { arbreTypeId: 'sco' },
        { arbreTypeId: 'des' },
        { arbreTypeId: 'aca', statutId: 'def' },
        { arbreTypeId: 'css' }
      ]
    ]
  }
]

export { arbreArmOct }
