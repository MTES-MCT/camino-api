import { IEtatIdDefinition } from '../demarches-etats-definitions'
import { etatComplementsGet, etatInformationsGet } from '../etat-cycles'

// https://cacoo.com/diagrams/oWuHFa1Y8cCdCqaB/B1B05
const etatsDefinitionArmOct: IEtatIdDefinition[] = [
  {
    etatId: 'mfr',
    justeApres: []
  },
  {
    etatId: 'mdp',
    separation: ['mcp'],
    justeApres: [[{ etatId: 'mfr' }]]
  },
  {
    etatId: 'pfd',
    justeApres: [],
    avant: [[{ etatId: 'mcp' }]]
  },
  ...etatComplementsGet({
    etatId: 'rde',
    separation: ['sca'],
    justeApres: [[]]
  }),
  ...etatComplementsGet({
    etatId: 'dae',
    separation: ['mcp'],
    justeApres: [[]]
  }),
  {
    etatId: 'mod',
    justeApres: [],
    apres: [
      [{ etatId: 'mdp' }],
      [{ etatId: 'rde', statutId: 'def' }],
      [{ etatId: 'dae', statutId: 'def' }]
    ],
    avant: [[{ etatId: 'sca' }]]
  },
  {
    etatId: 'mcp',
    justeApres: [
      [
        { titre: { contenu: { arm: { mecanise: { valeur: true } } } } },
        { etatId: 'dae', statutId: 'fav' },
        { etatId: 'mdp' }
      ],
      [
        { titre: { contenu: { arm: { mecanise: { valeur: true } } } } },
        { etatId: 'dae', statutId: 'fav' },
        { etatId: 'pfd' }
      ],
      [
        { titre: { contenu: { arm: { mecanise: { valeur: false } } } } },
        { etatId: 'mdp' }
      ],
      [
        { titre: { contenu: { arm: { mecanise: { valeur: false } } } } },
        { etatId: 'pfd' }
      ],
      [{ etatId: 'mcr', statutId: 'def' }],
      [{ etatId: 'mod' }],
      [{ etatId: 'rco-mcp' }]
    ]
  },
  {
    etatId: 'mco-mcp',
    justeApres: [[{ etatId: 'mcp', statutId: 'def' }]]
  },
  {
    etatId: 'rco-mcp',
    justeApres: [[{ etatId: 'mco-mcp' }]]
  },
  {
    etatId: 'vfd',
    avant: [[{ etatId: 'vfd' }]],
    justeApres: [
      [{ etatId: 'mcp', statutId: 'fav' }],
      [{ etatId: 'des' }],
      [{ etatId: 'mno-css' }]
    ]
  },
  {
    etatId: 'mif-mcr',
    avant: [[{ etatId: 'mcr', statutId: 'fav' }]],
    apres: [[{ etatId: 'vfd' }]],
    justeApres: [[{ etatId: 'vfd' }], [{ etatId: 'mcp', statutId: 'fav' }]]
  },
  {
    etatId: 'rif-mcr',
    justeApres: [[{ etatId: 'mif-mcr' }]]
  },
  {
    etatId: 'mcr',
    apres: [[{ etatId: 'vfd' }]],
    avant: [[{ etatId: 'mcr', statutId: 'fav' }]],
    separation: ['aof'],
    justeApres: [
      [{ etatId: 'rif-mcr' }],
      [{ etatId: 'vfd' }],
      [{ etatId: 'mcp', statutId: 'fav' }]
    ]
  },
  ...etatInformationsGet({
    etatId: 'edm',
    justeApres: [[{ etatId: 'mcr', statutId: 'fav' }]]
  }),
  {
    etatId: 'ede',
    justeApres: [[{ etatId: 'mcr', statutId: 'fav' }]]
  },
  ...etatInformationsGet({
    etatId: 'eof',
    justeApres: [[{ etatId: 'mcr', statutId: 'fav' }]]
  }),
  {
    etatId: 'mif-aof',
    justeApres: [[{ etatId: 'eof' }]]
  },
  {
    etatId: 'rif-aof',
    justeApres: [[{ etatId: 'mif-aof' }]]
  },
  {
    etatId: 'aof',
    justeApres: [[{ etatId: 'rif-aof' }], [{ etatId: 'eof' }]]
  },
  {
    etatId: 'sca',
    justeApres: [
      [
        { etatId: 'aof' },
        { etatId: 'rde', statutId: 'fav' },
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
        { etatId: 'aof' },
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
      [{ etatId: 'mno-sca' }],
      [{ etatId: 'rco-sca' }]
    ]
  },
  { etatId: 'aca', justeApres: [[{ etatId: 'sca' }]] },
  {
    etatId: 'mno-sca',
    justeApres: [[{ etatId: 'aca', statutId: 'ajo' }]]
  },
  {
    etatId: 'mco-sca',
    justeApres: [[{ etatId: 'mno-sca' }], [{ etatId: 'rco-sca' }]]
  },
  { etatId: 'rco-sca', justeApres: [[{ etatId: 'mco-sca' }]] },
  {
    etatId: 'mno-aca',
    justeApres: [
      [
        { etatId: 'aca', statutId: 'fav' },
        { titre: { contenu: { arm: { mecanise: { valeur: true } } } } }
      ]
    ]
  },
  {
    etatId: 'mno-rej',
    justeApres: [[{ etatId: 'aca', statutId: 'def' }]]
  },
  {
    etatId: 'pfc',
    justeApres: [[{ etatId: 'mno-aca' }]]
  },
  {
    etatId: 'vfc',
    avant: [[{ etatId: 'vfc' }]],
    justeApres: [
      [{ etatId: 'pfc' }],
      [
        { titre: { contenu: { arm: { mecanise: { valeur: true } } } } },
        { etatId: 'mno-css' }
      ],
      [
        { titre: { contenu: { arm: { mecanise: { valeur: true } } } } },
        { etatId: 'des' }
      ]
    ]
  },
  {
    etatId: 'sco',
    justeApres: [
      [
        { titre: { contenu: { arm: { mecanise: { valeur: false } } } } },
        { etatId: 'aca', statutId: 'fav' }
      ],
      [
        { titre: { contenu: { arm: { mecanise: { valeur: true } } } } },
        { etatId: 'vfc' }
      ]
    ]
  },
  {
    etatId: 'mno-sco',
    justeApres: [
      [
        { etatId: 'sco' },
        { titre: { contenu: { arm: { mecanise: { valeur: false } } } } }
      ]
    ]
  },
  {
    etatId: 'aco',
    justeApres: [
      [
        { etatId: 'sco' },
        { titre: { contenu: { arm: { mecanise: { valeur: true } } } } }
      ],
      [{ etatId: 'mno-aco' }],
      [{ etatId: 'mno-sco' }]
    ]
  },
  { etatId: 'mno-aco', justeApres: [[{ etatId: 'aco' }]] },
  {
    etatId: 'css',
    justeApres: [],
    apres: [
      [{ etatId: 'mdp' }],
      [{ etatId: 'pfd' }],
      [{ etatId: 'rde' }],
      [{ etatId: 'dae' }]
    ],
    avant: [
      [{ etatId: 'sco' }],
      [{ etatId: 'des' }],
      [{ etatId: 'aca', statutId: 'def' }]
    ]
  },
  { etatId: 'mno-css', justeApres: [[{ etatId: 'css' }]] },
  {
    etatId: 'des',
    justeApres: [],
    apres: [
      [{ etatId: 'mdp' }],
      [{ etatId: 'pfd' }],
      [{ etatId: 'rde' }],
      [{ etatId: 'dae' }]
    ],
    avant: [
      [{ etatId: 'sco' }],
      [{ etatId: 'aca', statutId: 'def' }],
      [{ etatId: 'css' }]
    ]
  }
]

export { etatsDefinitionArmOct }
