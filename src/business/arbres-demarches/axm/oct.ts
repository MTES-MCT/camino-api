// https://cacoo.com/diagrams/xHyYE2OZf9KCGFVc

import { IArbreEtape } from '../arbres-demarches'
import { arbreComplementsGet, arbreInformationsGet } from '../arbres-annexes'

const arbreAxmOct: IArbreEtape[] = [
  {
    arbreTypeId: 'mfr',
    separation: ['mdp'],
    justeApres: [[]]
  },
  {
    arbreTypeId: 'dsl',
    avant: [[{ arbreTypeId: 'asl' }]],
    justeApres: [[{ arbreTypeId: 'mfr' }]]
  },
  ...arbreInformationsGet({
    arbreTypeId: 'eof',
    justeApres: [[{ arbreTypeId: 'dsl' }]]
  }),
  {
    arbreTypeId: 'asl',
    justeApres: [],
    avant: [[{ arbreTypeId: 'asl' }]]
  },
  {
    arbreTypeId: 'qae',
    justeApres: [[{ arbreTypeId: 'mfr' }]],
    avant: [[{ arbreTypeId: 'dae' }]]
  },
  {
    arbreTypeId: 'dae',
    justeApres: [],
    avant: [[{ arbreTypeId: 'dae' }]]
  },
  {
    arbreTypeId: 'mod-dae',
    justeApres: [[{ arbreTypeId: 'dae', statutId: 'def' }]]
  },

  {
    arbreTypeId: 'mdp',
    justeApres: [
      [
        { arbreTypeId: 'asl', statutId: 'fav' },
        { arbreTypeId: 'dae', statutId: 'fav' },
        { arbreTypeId: 'mfr' }
      ]
    ]
  },
  {
    arbreTypeId: 'nis',
    justeApres: []
  },
  {
    arbreTypeId: 'mod-mdp',
    justeApres: [[{ arbreTypeId: 'mdp' }]]
  },
  ...arbreComplementsGet({
    arbreTypeId: 'mcr',
    justeApres: [[{ arbreTypeId: 'mdp' }], [{ arbreTypeId: 'mod' }]],
    separation: ['apd']
  }),
  {
    arbreTypeId: 'mif-apd',
    avant: [[{ arbreTypeId: 'apd' }]],
    justeApres: [[{ arbreTypeId: 'mcr' }], [{ arbreTypeId: 'rif-apd' }]]
  },
  {
    arbreTypeId: 'rif-apd',
    justeApres: [[{ arbreTypeId: 'mif-apd' }]]
  },
  {
    arbreTypeId: 'scl',
    justeApres: [[{ arbreTypeId: 'mcr', statutId: 'fav' }]]
  },
  {
    arbreTypeId: 'ama',
    justeApres: [[{ arbreTypeId: 'scl' }]]
  },
  {
    arbreTypeId: 'ssr',
    justeApres: [[{ arbreTypeId: 'mcr', statutId: 'fav' }]],
    separation: ['apd']
  },
  { arbreTypeId: 'cps', justeApres: [[{ arbreTypeId: 'ssr' }]] },
  { arbreTypeId: 'abs', justeApres: [[{ arbreTypeId: 'ssr' }]] },
  { arbreTypeId: 'auc', justeApres: [[{ arbreTypeId: 'ssr' }]] },
  { arbreTypeId: 'aec', justeApres: [[{ arbreTypeId: 'ssr' }]] },
  { arbreTypeId: 'aaf', justeApres: [[{ arbreTypeId: 'ssr' }]] },
  { arbreTypeId: 'aac', justeApres: [[{ arbreTypeId: 'ssr' }]] },
  { arbreTypeId: 'ars', justeApres: [[{ arbreTypeId: 'ssr' }]] },
  { arbreTypeId: 'afp', justeApres: [[{ arbreTypeId: 'ssr' }]] },
  { arbreTypeId: 'ass', justeApres: [[{ arbreTypeId: 'ssr' }]] },
  { arbreTypeId: 'aof', justeApres: [[{ arbreTypeId: 'ssr' }]] },
  { arbreTypeId: 'agn', justeApres: [[{ arbreTypeId: 'ssr' }]] },
  { arbreTypeId: 'api', justeApres: [[{ arbreTypeId: 'ssr' }]] },
  {
    arbreTypeId: 'apd',
    justeApres: [
      [{ arbreTypeId: 'cps' }, { arbreTypeId: 'scl' }],
      [{ arbreTypeId: 'apo', statutId: 'ajo' }]
    ]
  },
  {
    arbreTypeId: 'spo',
    justeApres: [[{ arbreTypeId: 'apd' }]]
  },
  {
    arbreTypeId: 'apo',
    justeApres: [[{ arbreTypeId: 'spo' }]]
  },
  {
    arbreTypeId: 'sas',
    justeApres: [[{ arbreTypeId: 'apo' }]]
  },
  {
    arbreTypeId: 'dex',
    justeApres: [[{ arbreTypeId: 'sas' }]]
  },
  { arbreTypeId: 'ihi', justeApres: [], apres: [] },
  { arbreTypeId: 'mno-dex', justeApres: [[{ arbreTypeId: 'dex' }]] },
  { arbreTypeId: 'rpu', justeApres: [[{ arbreTypeId: 'dex' }]] },
  { arbreTypeId: 'pqr', justeApres: [[{ arbreTypeId: 'dex' }]] },
  { arbreTypeId: 'ncl', justeApres: [[{ arbreTypeId: 'dex' }]] },
  { arbreTypeId: 'abd', justeApres: [[{ arbreTypeId: 'dex' }]] },
  { arbreTypeId: 'rtd', justeApres: [[{ arbreTypeId: 'dex' }]] },
  {
    arbreTypeId: 'and',
    justeApres: [[{ arbreTypeId: 'dex' }], [{ arbreTypeId: 'dim' }]]
  },
  {
    arbreTypeId: 'dim',
    justeApres: [[{ arbreTypeId: 'mdp' }]]
  },
  {
    arbreTypeId: 'css',
    justeApres: [[]],
    apres: [
      [
        { arbreTypeId: 'mdp' },
        { arbreTypeId: 'asl', statutId: 'def' },
        { arbreTypeId: 'dae', statutId: 'def' }
      ]
    ],
    avant: [
      [{ arbreTypeId: 'dex' }],
      [{ arbreTypeId: 'dim' }],
      [{ arbreTypeId: 'des' }]
    ]
  },
  {
    arbreTypeId: 'des',
    justeApres: [[]],
    apres: [
      [{ arbreTypeId: 'mfr' }, { arbreTypeId: 'asl' }, { arbreTypeId: 'dae' }]
    ],
    avant: [
      [{ arbreTypeId: 'dex' }],
      [{ arbreTypeId: 'dim' }],
      [{ arbreTypeId: 'css' }]
    ]
  }
]

export { arbreAxmOct }
