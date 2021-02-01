import { IDemarcheDefinitionRestrictions } from '../definitions'
// https://cacoo.com/diagrams/mdAnl7m9V2ViBlxA/C4063

const etatsDefinitionPrmOct: IDemarcheDefinitionRestrictions[] = [
  {
    etapeTypeId: 'mfr',
    justeApres: [[]]
  },
  {
    etapeTypeId: 'mdp',
    justeApres: [[{ etapeTypeId: 'mfr' }]]
  },
  {
    etapeTypeId: 'nis',
    apres: [[{ etapeTypeId: 'mdp' }]],
    justeApres: [],
    final: false
  },
  {
    etapeTypeId: 'mod',
    justeApres: [[]],
    apres: [[{ etapeTypeId: 'mdp' }]],
    avant: [[{ etapeTypeId: 'dex' }]],
    final: false
  },
  {
    etapeTypeId: 'mif',
    justeApres: [[]],
    apres: [[{ etapeTypeId: 'mdp' }]],
    avant: [[{ etapeTypeId: 'dex' }]],
    final: false
  },
  {
    etapeTypeId: 'rif',
    justeApres: [[{ etapeTypeId: 'mif' }]],
    avant: [[{ etapeTypeId: 'sas' }]],
    final: false
  },
  {
    etapeTypeId: 'spp',
    justeApres: [[{ etapeTypeId: 'mdp' }]]
  },
  {
    etapeTypeId: 'mcr',
    justeApres: [[{ etapeTypeId: 'spp' }], [{ etapeTypeId: 'rco' }]]
  },
  {
    etapeTypeId: 'mco',
    justeApres: [
      [{ etapeTypeId: 'mcr', statutId: 'def' }],
      [{ etapeTypeId: 'rco' }]
    ]
  },
  { etapeTypeId: 'rco', justeApres: [[{ etapeTypeId: 'mco' }]] },
  {
    etapeTypeId: 'anf',
    justeApres: [[{ etapeTypeId: 'mcr', statutId: 'fav' }]]
  },
  {
    etapeTypeId: 'mec',
    separation: ['scg'],
    justeApres: [[{ etapeTypeId: 'anf' }]]
  },
  {
    etapeTypeId: 'scl',
    separation: ['spo'],
    justeApres: [[{ etapeTypeId: 'mec' }]]
  },
  {
    etapeTypeId: 'ama',
    justeApres: [[{ etapeTypeId: 'scl' }]],
    avant: [[{ etapeTypeId: 'spo' }]]
  },
  {
    etapeTypeId: 'aep',
    justeApres: [[{ etapeTypeId: 'scl' }]],
    avant: [[{ etapeTypeId: 'spo' }]]
  },
  {
    etapeTypeId: 'acl',
    justeApres: [[{ etapeTypeId: 'scl' }]],
    avant: [[{ etapeTypeId: 'spo' }]]
  },
  {
    etapeTypeId: 'ssr',
    separation: ['spo'],
    justeApres: [[{ etapeTypeId: 'mec' }]]
  },
  {
    etapeTypeId: 'apl',
    justeApres: [[{ etapeTypeId: 'ssr' }]],
    avant: [[{ etapeTypeId: 'spo' }]]
  },
  {
    etapeTypeId: 'apm',
    justeApres: [[{ etapeTypeId: 'ssr' }]],
    avant: [[{ etapeTypeId: 'spo' }]]
  },
  {
    etapeTypeId: 'pnr',
    justeApres: [[{ etapeTypeId: 'ssr' }]],
    avant: [[{ etapeTypeId: 'spo' }]]
  },
  {
    etapeTypeId: 'apn',
    justeApres: [[{ etapeTypeId: 'ssr' }]],
    avant: [[{ etapeTypeId: 'spo' }]]
  },
  {
    etapeTypeId: 'aof',
    justeApres: [[{ etapeTypeId: 'ssr' }]],
    avant: [[{ etapeTypeId: 'spo' }]]
  },
  {
    etapeTypeId: 'aop',
    justeApres: [[{ etapeTypeId: 'ssr' }]],
    avant: [[{ etapeTypeId: 'spo' }]]
  },
  {
    etapeTypeId: 'spo',
    justeApres: [],
    avant: [[{ etapeTypeId: 'spo' }]],
    apres: [[{ etapeTypeId: 'scl' }, { etapeTypeId: 'ssr' }]]
  },
  { etapeTypeId: 'apo', justeApres: [[{ etapeTypeId: 'spo' }]] },
  { etapeTypeId: 'apd', justeApres: [[{ etapeTypeId: 'apo' }]] },
  { etapeTypeId: 'app', justeApres: [[{ etapeTypeId: 'apd' }]] },
  {
    etapeTypeId: 'ppu',
    justeApres: [[{ etapeTypeId: 'mec' }]],
    avant: [[{ etapeTypeId: 'ppu' }]]
  },
  { etapeTypeId: 'ppc', justeApres: [[{ etapeTypeId: 'ppu' }]] },
  {
    etapeTypeId: 'scg',
    justeApres: [[{ etapeTypeId: 'app' }, { etapeTypeId: 'ppc' }]]
  },
  {
    etapeTypeId: 'rcg',
    justeApres: [[{ etapeTypeId: 'scg' }]]
  },
  { etapeTypeId: 'acg', justeApres: [[{ etapeTypeId: 'rcg' }]] },
  { etapeTypeId: 'sas', justeApres: [[{ etapeTypeId: 'acg' }]] },
  { etapeTypeId: 'dex', justeApres: [[{ etapeTypeId: 'sas' }]] },
  {
    etapeTypeId: 'dpu',
    justeApres: [
      [{ etapeTypeId: 'dex', statutId: 'acc' }],
      [{ etapeTypeId: 'abd' }],
      [{ etapeTypeId: 'rtd' }]
    ]
  },
  {
    etapeTypeId: 'npp',
    justeApres: [
      [{ etapeTypeId: 'dex', statutId: 'rej' }],
      [{ etapeTypeId: 'dpu', statutId: 'acc' }]
    ],
    avant: [[{ etapeTypeId: 'abd' }], [{ etapeTypeId: 'rtd' }]]
  },
  {
    etapeTypeId: 'mno',
    apres: [[{ etapeTypeId: 'npp' }]],
    avant: [[{ etapeTypeId: 'mno' }]],
    justeApres: []
  },
  {
    etapeTypeId: 'rpu',
    apres: [[{ etapeTypeId: 'dex', statutId: 'acc' }, { etapeTypeId: 'npp' }]],
    avant: [[{ etapeTypeId: 'rpu' }]],
    justeApres: []
  },
  {
    etapeTypeId: 'ncl',
    apres: [[{ etapeTypeId: 'dex', statutId: 'acc' }, { etapeTypeId: 'npp' }]],
    avant: [[{ etapeTypeId: 'ncl' }]],
    justeApres: []
  },
  {
    etapeTypeId: 'pqr',
    apres: [[{ etapeTypeId: 'dex', statutId: 'acc' }, { etapeTypeId: 'npp' }]],
    avant: [[{ etapeTypeId: 'pqr' }]],
    justeApres: []
  },
  {
    etapeTypeId: 'dim',
    justeApres: [[{ etapeTypeId: 'mdp' }]],
    avant: [[{ etapeTypeId: 'dex' }]]
  },
  {
    etapeTypeId: 'and',
    justeApres: [[{ etapeTypeId: 'dim' }], [{ etapeTypeId: 'dex' }]],
    final: true
  },
  {
    etapeTypeId: 'abd',
    justeApres: [[{ etapeTypeId: 'dex' }]],
    avant: [[{ etapeTypeId: 'and' }], [{ etapeTypeId: 'rtd' }]]
  },
  {
    etapeTypeId: 'rtd',
    justeApres: [[{ etapeTypeId: 'dex' }]],
    avant: [[{ etapeTypeId: 'and' }], [{ etapeTypeId: 'abd' }]]
  },
  {
    etapeTypeId: 'des',
    justeApres: [[]],
    avant: [
      [{ etapeTypeId: 'dex' }],
      [{ etapeTypeId: 'css' }],
      [{ etapeTypeId: 'dim' }]
    ],
    final: true,
    apres: [[{ etapeTypeId: 'mdp' }]]
  },
  {
    etapeTypeId: 'css',
    justeApres: [[]],
    avant: [
      [{ etapeTypeId: 'dex' }],
      [{ etapeTypeId: 'des' }],
      [{ etapeTypeId: 'dim' }]
    ],
    final: true,
    apres: [[{ etapeTypeId: 'mdp' }]]
  }
]

export { etatsDefinitionPrmOct }
