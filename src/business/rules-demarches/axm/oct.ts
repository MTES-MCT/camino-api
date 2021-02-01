import { IDemarcheDefinitionRestrictions } from '../definitions'
import { etatInformationsGet } from '../etat-cycles'

// https://cacoo.com/diagrams/xHyYE2OZf9KCGFVc
const restrictionsAxmOct: IDemarcheDefinitionRestrictions[] = [
  {
    etapeTypeId: 'mfr',
    // FIXME normalement c’est jusqu’à la MDP, mais la DGTM n’a pas le temps de s’adapter à cette modification
    separation: ['mcr'],
    justeApres: [[]]
  },
  {
    etapeTypeId: 'dsl',
    avant: [[{ etapeTypeId: 'asl' }]],
    justeApres: [[{ etapeTypeId: 'mfr' }]]
  },
  ...etatInformationsGet('mio', 'rio', {
    etapeTypeId: 'eof',
    justeApres: [[{ etapeTypeId: 'dsl' }]]
  }),
  {
    etapeTypeId: 'asl',
    justeApres: [],
    avant: [[{ etapeTypeId: 'asl' }]]
  },
  {
    etapeTypeId: 'qae',
    justeApres: [[{ etapeTypeId: 'mfr' }]],
    avant: [[{ etapeTypeId: 'dae' }]]
  },
  {
    etapeTypeId: 'dae',
    justeApres: [],
    avant: [[{ etapeTypeId: 'dae' }]]
  },
  {
    etapeTypeId: 'mom',
    justeApres: [[{ etapeTypeId: 'dae', statutId: 'def' }]]
  },

  {
    etapeTypeId: 'mdp',
    avant: [[{ etapeTypeId: 'mdp' }]],
    justeApres: [
      [{ etapeTypeId: 'mfr' }, { etapeTypeId: 'dae', statutId: 'fav' }],
      [{ etapeTypeId: 'mfr' }, { etapeTypeId: 'mom' }]
    ]
  },
  {
    etapeTypeId: 'nis',
    justeApres: [[]],
    apres: [[{ etapeTypeId: 'mfr' }]],
    final: false
  },
  {
    etapeTypeId: 'mod',
    justeApres: [[{ etapeTypeId: 'mdp' }]]
  },
  {
    etapeTypeId: 'mca',
    justeApres: [[{ etapeTypeId: 'mdp' }], [{ etapeTypeId: 'rca' }]],
    avant: [[{ etapeTypeId: 'mcr' }]]
  },
  { etapeTypeId: 'rca', justeApres: [[{ etapeTypeId: 'mca' }]] },
  {
    etapeTypeId: 'mcr',
    justeApres: [
      [{ etapeTypeId: 'mdp' }, { etapeTypeId: 'asl', statutId: 'fav' }],
      [{ etapeTypeId: 'mdp' }, { etapeTypeId: 'asl', statutId: 'fav' }],
      [{ etapeTypeId: 'rca' }, { etapeTypeId: 'asl', statutId: 'fav' }],
      [{ etapeTypeId: 'rca' }, { etapeTypeId: 'asl', statutId: 'fav' }],
      [{ etapeTypeId: 'mod' }, { etapeTypeId: 'asl', statutId: 'fav' }],
      [{ etapeTypeId: 'mod' }]
    ],
    separation: ['apd']
  },
  {
    etapeTypeId: 'mie',
    avant: [[{ etapeTypeId: 'apd' }]],
    justeApres: [[{ etapeTypeId: 'mcr' }], [{ etapeTypeId: 'rie' }]]
  },
  {
    etapeTypeId: 'rie',
    justeApres: [[{ etapeTypeId: 'mie' }]]
  },
  {
    etapeTypeId: 'scl',
    justeApres: [[{ etapeTypeId: 'mcr', statutId: 'fav' }]]
  },
  {
    etapeTypeId: 'ama',
    justeApres: [[{ etapeTypeId: 'scl' }]]
  },
  {
    etapeTypeId: 'ssr',
    justeApres: [[{ etapeTypeId: 'mcr', statutId: 'fav' }]],
    separation: ['apd']
  },
  { etapeTypeId: 'cps', justeApres: [[{ etapeTypeId: 'ssr' }]] },
  { etapeTypeId: 'abs', justeApres: [[{ etapeTypeId: 'ssr' }]] },
  { etapeTypeId: 'auc', justeApres: [[{ etapeTypeId: 'ssr' }]] },
  { etapeTypeId: 'aec', justeApres: [[{ etapeTypeId: 'ssr' }]] },
  { etapeTypeId: 'aaf', justeApres: [[{ etapeTypeId: 'ssr' }]] },
  { etapeTypeId: 'aac', justeApres: [[{ etapeTypeId: 'ssr' }]] },
  { etapeTypeId: 'ars', justeApres: [[{ etapeTypeId: 'ssr' }]] },
  { etapeTypeId: 'afp', justeApres: [[{ etapeTypeId: 'ssr' }]] },
  { etapeTypeId: 'ass', justeApres: [[{ etapeTypeId: 'ssr' }]] },
  { etapeTypeId: 'aof', justeApres: [[{ etapeTypeId: 'ssr' }]] },
  { etapeTypeId: 'agn', justeApres: [[{ etapeTypeId: 'ssr' }]] },
  { etapeTypeId: 'api', justeApres: [[{ etapeTypeId: 'ssr' }]] },
  {
    etapeTypeId: 'apd',
    apres: [[{ etapeTypeId: 'scl' }]],
    justeApres: [
      [{ etapeTypeId: 'cps' }],
      [{ etapeTypeId: 'apo', statutId: 'ajo' }]
    ]
  },
  {
    etapeTypeId: 'spo',
    justeApres: [[{ etapeTypeId: 'apd' }]]
  },
  {
    etapeTypeId: 'apo',
    justeApres: [[{ etapeTypeId: 'spo' }]]
  },
  {
    etapeTypeId: 'sas',
    justeApres: [
      [{ etapeTypeId: 'apo', statutId: 'fav' }],
      [{ etapeTypeId: 'apo', statutId: 'def' }]
    ]
  },
  {
    etapeTypeId: 'dex',
    justeApres: [[{ etapeTypeId: 'sas' }]],
    separation: []
  },
  {
    etapeTypeId: 'mno',
    justeApres: [[{ etapeTypeId: 'dex' }]],
    avant: [
      [{ etapeTypeId: 'abd' }],
      [{ etapeTypeId: 'rtd' }],
      [{ etapeTypeId: 'and' }]
    ]
  },
  {
    etapeTypeId: 'rpu',
    justeApres: [[{ etapeTypeId: 'dex' }]],
    avant: [
      [{ etapeTypeId: 'abd' }],
      [{ etapeTypeId: 'rtd' }],
      [{ etapeTypeId: 'and' }]
    ]
  },
  {
    etapeTypeId: 'pqr',
    justeApres: [[{ etapeTypeId: 'dex' }]],
    avant: [
      [{ etapeTypeId: 'abd' }],
      [{ etapeTypeId: 'rtd' }],
      [{ etapeTypeId: 'and' }]
    ]
  },
  {
    etapeTypeId: 'ncl',
    justeApres: [[{ etapeTypeId: 'dex' }]],
    avant: [
      [{ etapeTypeId: 'abd' }],
      [{ etapeTypeId: 'rtd' }],
      [{ etapeTypeId: 'and' }]
    ]
  },
  {
    etapeTypeId: 'abd',
    justeApres: [[{ etapeTypeId: 'dex' }]],
    avant: [
      [{ etapeTypeId: 'abd' }],
      [{ etapeTypeId: 'rtd' }],
      [{ etapeTypeId: 'and' }],
      [{ etapeTypeId: 'mno' }],
      [{ etapeTypeId: 'rpu' }],
      [{ etapeTypeId: 'pqr' }],
      [{ etapeTypeId: 'ncl' }]
    ]
  },
  {
    etapeTypeId: 'rtd',
    justeApres: [[{ etapeTypeId: 'dex' }]],
    avant: [
      [{ etapeTypeId: 'abd' }],
      [{ etapeTypeId: 'rtd' }],
      [{ etapeTypeId: 'and' }],
      [{ etapeTypeId: 'mno' }],
      [{ etapeTypeId: 'rpu' }],
      [{ etapeTypeId: 'pqr' }],
      [{ etapeTypeId: 'ncl' }]
    ]
  },
  {
    etapeTypeId: 'and',
    justeApres: [[{ etapeTypeId: 'dex' }], [{ etapeTypeId: 'dim' }]],
    avant: [
      [{ etapeTypeId: 'abd' }],
      [{ etapeTypeId: 'rtd' }],
      [{ etapeTypeId: 'and' }],
      [{ etapeTypeId: 'mno' }],
      [{ etapeTypeId: 'rpu' }],
      [{ etapeTypeId: 'pqr' }],
      [{ etapeTypeId: 'ncl' }]
    ]
  },
  {
    etapeTypeId: 'dim',
    justeApres: [[{ etapeTypeId: 'mdp' }]]
  },
  {
    etapeTypeId: 'css',
    justeApres: [[]],
    apres: [
      [
        { etapeTypeId: 'mdp' },
        { etapeTypeId: 'asl', statutId: 'def' },
        { etapeTypeId: 'dae', statutId: 'def' }
      ]
    ],
    avant: [
      [{ etapeTypeId: 'dex' }],
      [{ etapeTypeId: 'dim' }],
      [{ etapeTypeId: 'des' }]
    ]
  },
  {
    etapeTypeId: 'des',
    justeApres: [[]],
    apres: [
      [{ etapeTypeId: 'mfr' }, { etapeTypeId: 'asl' }, { etapeTypeId: 'dae' }]
    ],
    avant: [
      [{ etapeTypeId: 'dex' }],
      [{ etapeTypeId: 'dim' }],
      [{ etapeTypeId: 'css' }]
    ]
  }
]

export { restrictionsAxmOct }
