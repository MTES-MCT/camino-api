// https://cacoo.com/diagrams/xHyYE2OZf9KCGFVc

import { IEtatIdDefinition } from '../demarches-etats-definitions'
import { etatInformationsGet } from '../etat-cycles'

const etatsDefinitionAxmOct: IEtatIdDefinition[] = [
  {
    etatId: 'mfr',
    // FIXME normalement c’est jusqu’à la MDP, mais la DGTM n’a pas le temps de s’adapter à cette modification
    separation: ['mcr'],
    justeApres: [[]]
  },
  {
    etatId: 'dsl',
    avant: [[{ etatId: 'asl' }]],
    justeApres: [[{ etatId: 'mfr' }]]
  },
  ...etatInformationsGet({
    etatId: 'eof',
    justeApres: [[{ etatId: 'dsl' }]]
  }),
  {
    etatId: 'asl',
    justeApres: [],
    avant: [[{ etatId: 'asl' }]]
  },
  {
    etatId: 'qae',
    justeApres: [[{ etatId: 'mfr' }]],
    avant: [[{ etatId: 'dae' }]]
  },
  {
    etatId: 'dae',
    justeApres: [],
    avant: [[{ etatId: 'dae' }]]
  },
  {
    etatId: 'mod-dae',
    justeApres: [[{ etatId: 'dae', statutId: 'def' }]]
  },

  {
    etatId: 'mdp',
    justeApres: [[{ etatId: 'mfr' }]]
  },
  {
    etatId: 'nis',
    justeApres: []
  },
  {
    etatId: 'mod-mdp',
    justeApres: [[{ etatId: 'mdp' }]]
  },
  {
    etatId: 'mco-mcr',
    justeApres: [[{ etatId: 'mdp' }], [{ etatId: 'rco-mcr' }]],
    avant: [[{ etatId: 'mcr' }]]
  },
  { etatId: 'rco-mcr', justeApres: [[{ etatId: 'mco-mcr' }]] },
  {
    etatId: 'mcr',
    justeApres: [
      [
        { etatId: 'mdp' },
        { etatId: 'asl', statutId: 'fav' },
        { etatId: 'dae', statutId: 'fav' }
      ],
      [
        { etatId: 'mdp' },
        { etatId: 'asl', statutId: 'fav' },
        { etatId: 'mod-dae' }
      ],
      [
        { etatId: 'rco-mcr' },
        { etatId: 'asl', statutId: 'fav' },
        { etatId: 'dae', statutId: 'fav' }
      ],
      [
        { etatId: 'rco-mcr' },
        { etatId: 'asl', statutId: 'fav' },
        { etatId: 'mod-dae' }
      ],
      [
        { etatId: 'mod-mdp' },
        { etatId: 'asl', statutId: 'fav' },
        { etatId: 'dae', statutId: 'fav' }
      ],
      [
        { etatId: 'mod-mdp' },
        { etatId: 'asl', statutId: 'fav' },
        { etatId: 'mod-dae' }
      ]
    ],
    separation: ['apd']
  },
  {
    etatId: 'mif-apd',
    avant: [[{ etatId: 'apd' }]],
    justeApres: [[{ etatId: 'mcr' }], [{ etatId: 'rif-apd' }]]
  },
  {
    etatId: 'rif-apd',
    justeApres: [[{ etatId: 'mif-apd' }]]
  },
  {
    etatId: 'scl',
    justeApres: [[{ etatId: 'mcr', statutId: 'fav' }]]
  },
  {
    etatId: 'ama',
    justeApres: [[{ etatId: 'scl' }]]
  },
  {
    etatId: 'ssr',
    justeApres: [[{ etatId: 'mcr', statutId: 'fav' }]],
    separation: ['apd']
  },
  { etatId: 'cps', justeApres: [[{ etatId: 'ssr' }]] },
  { etatId: 'abs', justeApres: [[{ etatId: 'ssr' }]] },
  { etatId: 'auc', justeApres: [[{ etatId: 'ssr' }]] },
  { etatId: 'aec', justeApres: [[{ etatId: 'ssr' }]] },
  { etatId: 'aaf', justeApres: [[{ etatId: 'ssr' }]] },
  { etatId: 'aac', justeApres: [[{ etatId: 'ssr' }]] },
  { etatId: 'ars', justeApres: [[{ etatId: 'ssr' }]] },
  { etatId: 'afp', justeApres: [[{ etatId: 'ssr' }]] },
  { etatId: 'ass', justeApres: [[{ etatId: 'ssr' }]] },
  { etatId: 'aof', justeApres: [[{ etatId: 'ssr' }]] },
  { etatId: 'agn', justeApres: [[{ etatId: 'ssr' }]] },
  { etatId: 'api', justeApres: [[{ etatId: 'ssr' }]] },
  {
    etatId: 'apd',
    justeApres: [
      [{ etatId: 'cps' }, { etatId: 'scl' }],
      [{ etatId: 'apo', statutId: 'ajo' }]
    ]
  },
  {
    etatId: 'spo',
    justeApres: [[{ etatId: 'apd' }]]
  },
  {
    etatId: 'apo',
    justeApres: [[{ etatId: 'spo' }]]
  },
  {
    etatId: 'sas',
    justeApres: [
      [{ etatId: 'apo', statutId: 'fav' }],
      [{ etatId: 'apo', statutId: 'def' }]
    ]
  },
  {
    etatId: 'dex',
    justeApres: [[{ etatId: 'sas' }]],
    separation: []
  },
  { etatId: 'mno-dex', justeApres: [[{ etatId: 'dex' }]] },
  { etatId: 'rpu', justeApres: [[{ etatId: 'dex' }]] },
  { etatId: 'pqr', justeApres: [[{ etatId: 'dex' }]] },
  { etatId: 'ncl', justeApres: [[{ etatId: 'dex' }]] },
  { etatId: 'abd', justeApres: [[{ etatId: 'dex' }]] },
  { etatId: 'rtd', justeApres: [[{ etatId: 'dex' }]] },
  {
    etatId: 'and',
    justeApres: [[{ etatId: 'dex' }], [{ etatId: 'dim' }]]
  },
  {
    etatId: 'dim',
    justeApres: [[{ etatId: 'mdp' }]]
  },
  {
    etatId: 'css',
    justeApres: [[]],
    apres: [
      [
        { etatId: 'mdp' },
        { etatId: 'asl', statutId: 'def' },
        { etatId: 'dae', statutId: 'def' }
      ]
    ],
    avant: [[{ etatId: 'dex' }], [{ etatId: 'dim' }], [{ etatId: 'des' }]]
  },
  {
    etatId: 'des',
    justeApres: [[]],
    apres: [[{ etatId: 'mfr' }, { etatId: 'asl' }, { etatId: 'dae' }]],
    avant: [[{ etatId: 'dex' }], [{ etatId: 'dim' }], [{ etatId: 'css' }]]
  }
]

export { etatsDefinitionAxmOct }
