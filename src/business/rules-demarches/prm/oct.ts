// https://cacoo.com/diagrams/mdAnl7m9V2ViBlxA/C4063

import { IDemarcheDefinitionRestrictions } from '../definitions'

const etatsDefinitionPrmOct: IDemarcheDefinitionRestrictions = {
  mfr: {
    justeApres: [[]]
  },
  nis: {
    apres: [[{ etapeTypeId: 'mfr', statutId: 'dep' }]],
    justeApres: [],
    final: false
  },
  mod: {
    justeApres: [[]],
    apres: [[{ etapeTypeId: 'mfr', statutId: 'dep' }]],
    avant: [[{ etapeTypeId: 'dex' }]],
    final: false
  },
  mif: {
    justeApres: [[]],
    apres: [[{ etapeTypeId: 'mfr', statutId: 'dep' }]],
    avant: [[{ etapeTypeId: 'dex' }]],
    final: false
  },
  rif: {
    justeApres: [[{ etapeTypeId: 'mif' }]],
    avant: [[{ etapeTypeId: 'sas' }]],
    final: false
  },
  spp: {
    justeApres: [[{ etapeTypeId: 'mfr', statutId: 'dep' }]]
  },
  mcr: {
    justeApres: [[{ etapeTypeId: 'spp' }], [{ etapeTypeId: 'rco' }]]
  },
  mco: {
    justeApres: [
      [{ etapeTypeId: 'mcr', statutId: 'def' }],
      [{ etapeTypeId: 'rco' }]
    ]
  },
  rco: { justeApres: [[{ etapeTypeId: 'mco' }]] },
  anf: {
    justeApres: [[{ etapeTypeId: 'mcr', statutId: 'fav' }]]
  },
  mec: {
    separation: ['scg'],
    justeApres: [[{ etapeTypeId: 'anf' }]]
  },
  scl: {
    separation: ['spo'],
    justeApres: [[{ etapeTypeId: 'mec' }]]
  },
  ama: {
    justeApres: [[{ etapeTypeId: 'scl' }]],
    avant: [[{ etapeTypeId: 'spo' }]]
  },
  aep: {
    justeApres: [[{ etapeTypeId: 'scl' }]],
    avant: [[{ etapeTypeId: 'spo' }]]
  },
  acl: {
    justeApres: [[{ etapeTypeId: 'scl' }]],
    avant: [[{ etapeTypeId: 'spo' }]]
  },
  ssr: {
    separation: ['spo'],
    justeApres: [[{ etapeTypeId: 'mec' }]]
  },
  apl: {
    justeApres: [[{ etapeTypeId: 'ssr' }]],
    avant: [[{ etapeTypeId: 'spo' }]]
  },
  apm: {
    justeApres: [[{ etapeTypeId: 'ssr' }]],
    avant: [[{ etapeTypeId: 'spo' }]]
  },
  pnr: {
    justeApres: [[{ etapeTypeId: 'ssr' }]],
    avant: [[{ etapeTypeId: 'spo' }]]
  },
  apn: {
    justeApres: [[{ etapeTypeId: 'ssr' }]],
    avant: [[{ etapeTypeId: 'spo' }]]
  },
  aof: {
    justeApres: [[{ etapeTypeId: 'ssr' }]],
    avant: [[{ etapeTypeId: 'spo' }]]
  },
  aop: {
    justeApres: [[{ etapeTypeId: 'ssr' }]],
    avant: [[{ etapeTypeId: 'spo' }]]
  },
  spo: {
    justeApres: [],
    avant: [[{ etapeTypeId: 'spo' }]],
    apres: [[{ etapeTypeId: 'scl' }, { etapeTypeId: 'ssr' }]]
  },
  apo: { justeApres: [[{ etapeTypeId: 'spo' }]] },
  apd: { justeApres: [[{ etapeTypeId: 'apo' }]] },
  app: { justeApres: [[{ etapeTypeId: 'apd' }]] },
  ppu: {
    justeApres: [[{ etapeTypeId: 'mec' }]],
    avant: [[{ etapeTypeId: 'ppu' }]]
  },
  ppc: { justeApres: [[{ etapeTypeId: 'ppu' }]] },
  scg: {
    justeApres: [[{ etapeTypeId: 'app' }, { etapeTypeId: 'ppc' }]]
  },
  rcg: {
    justeApres: [[{ etapeTypeId: 'scg' }]]
  },
  acg: { justeApres: [[{ etapeTypeId: 'rcg' }]] },
  sas: { justeApres: [[{ etapeTypeId: 'acg' }]] },
  dex: { justeApres: [[{ etapeTypeId: 'sas' }]] },
  dpu: {
    justeApres: [
      [{ etapeTypeId: 'dex', statutId: 'acc' }],
      [{ etapeTypeId: 'abd' }],
      [{ etapeTypeId: 'rtd' }]
    ]
  },
  npp: {
    justeApres: [
      [{ etapeTypeId: 'dex', statutId: 'rej' }],
      [{ etapeTypeId: 'dpu', statutId: 'acc' }]
    ],
    avant: [[{ etapeTypeId: 'abd' }], [{ etapeTypeId: 'rtd' }]]
  },
  mno: {
    apres: [[{ etapeTypeId: 'npp' }]],
    avant: [[{ etapeTypeId: 'mno' }]],
    justeApres: []
  },
  rpu: {
    apres: [[{ etapeTypeId: 'dex', statutId: 'acc' }, { etapeTypeId: 'npp' }]],
    avant: [[{ etapeTypeId: 'rpu' }]],
    justeApres: []
  },
  ncl: {
    apres: [[{ etapeTypeId: 'dex', statutId: 'acc' }, { etapeTypeId: 'npp' }]],
    avant: [[{ etapeTypeId: 'ncl' }]],
    justeApres: []
  },
  pqr: {
    apres: [[{ etapeTypeId: 'dex', statutId: 'acc' }, { etapeTypeId: 'npp' }]],
    avant: [[{ etapeTypeId: 'pqr' }]],
    justeApres: []
  },
  dim: {
    justeApres: [[{ etapeTypeId: 'mfr', statutId: 'dep' }]],
    avant: [[{ etapeTypeId: 'dex' }]]
  },
  and: {
    justeApres: [[{ etapeTypeId: 'dim' }], [{ etapeTypeId: 'dex' }]],
    final: true
  },
  abd: {
    justeApres: [[{ etapeTypeId: 'dex' }]],
    avant: [[{ etapeTypeId: 'and' }], [{ etapeTypeId: 'rtd' }]]
  },
  rtd: {
    justeApres: [[{ etapeTypeId: 'dex' }]],
    avant: [[{ etapeTypeId: 'and' }], [{ etapeTypeId: 'abd' }]]
  },
  des: {
    justeApres: [[]],
    avant: [
      [{ etapeTypeId: 'dex' }],
      [{ etapeTypeId: 'css' }],
      [{ etapeTypeId: 'dim' }]
    ],
    final: true,
    apres: [[{ etapeTypeId: 'mfr', statutId: 'dep' }]]
  },
  css: {
    justeApres: [[]],
    avant: [
      [{ etapeTypeId: 'dex' }],
      [{ etapeTypeId: 'des' }],
      [{ etapeTypeId: 'dim' }]
    ],
    final: true,
    apres: [[{ etapeTypeId: 'mfr', statutId: 'dep' }]]
  },
  edm: {
    justeApres: [[]],
    avant: [[{ etapeTypeId: 'mfr' }]],
    apres: [[{ etapeTypeId: 'mfr' }]]
  }
}

export { etatsDefinitionPrmOct }
