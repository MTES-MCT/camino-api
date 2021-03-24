import { IDemarcheDefinitionRestrictions } from '../definitions'
import { etatInformationsGet } from '../etat-cycles'

const restrictionsAxmOct: IDemarcheDefinitionRestrictions = {
  mfr: {
    // FIXME normalement c’est jusqu’à la MDP, mais la DGTM n’a pas le temps de s’adapter à cette modification
    separation: ['mcr'],
    justeApres: [[]]
  },
  dsl: {
    avant: [[{ etapeTypeId: 'asl' }]],
    justeApres: [[{ etapeTypeId: 'mfr' }]]
  },
  ...etatInformationsGet('mio', 'rio', {
    etapeTypeId: 'eof',
    justeApres: [[{ etapeTypeId: 'dsl' }]]
  }),
  asl: {
    justeApres: [],
    avant: [[{ etapeTypeId: 'asl' }]]
  },
  qae: {
    justeApres: [[{ etapeTypeId: 'mfr' }]],
    avant: [[{ etapeTypeId: 'dae' }]]
  },
  dae: {
    justeApres: [],
    avant: [[{ etapeTypeId: 'dae' }]]
  },
  mom: {
    justeApres: [[{ etapeTypeId: 'dae', statutId: 'def' }]]
  },
  mdp: {
    avant: [[{ etapeTypeId: 'mdp' }]],
    justeApres: [
      [{ etapeTypeId: 'mfr' }, { etapeTypeId: 'dae', statutId: 'fav' }],
      [{ etapeTypeId: 'mfr' }, { etapeTypeId: 'mom' }]
    ]
  },
  nis: {
    justeApres: [[]],
    apres: [[{ etapeTypeId: 'mfr' }]],
    final: false
  },
  mod: {
    justeApres: [[{ etapeTypeId: 'mdp' }]]
  },
  mca: {
    justeApres: [[{ etapeTypeId: 'mdp' }], [{ etapeTypeId: 'rca' }]],
    avant: [[{ etapeTypeId: 'mcr' }]]
  },
  rca: { justeApres: [[{ etapeTypeId: 'mca' }]] },
  mcr: {
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
  mie: {
    avant: [[{ etapeTypeId: 'apd' }]],
    justeApres: [[{ etapeTypeId: 'mcr' }], [{ etapeTypeId: 'rie' }]]
  },
  rie: {
    justeApres: [[{ etapeTypeId: 'mie' }]]
  },
  scl: {
    justeApres: [[{ etapeTypeId: 'mcr', statutId: 'fav' }]]
  },
  ama: {
    justeApres: [[{ etapeTypeId: 'scl' }]]
  },
  ssr: {
    justeApres: [[{ etapeTypeId: 'mcr', statutId: 'fav' }]],
    separation: ['apd']
  },
  cps: { justeApres: [[{ etapeTypeId: 'ssr' }]] },
  abs: { justeApres: [[{ etapeTypeId: 'ssr' }]] },
  auc: { justeApres: [[{ etapeTypeId: 'ssr' }]] },
  aec: { justeApres: [[{ etapeTypeId: 'ssr' }]] },
  aaf: { justeApres: [[{ etapeTypeId: 'ssr' }]] },
  aac: { justeApres: [[{ etapeTypeId: 'ssr' }]] },
  ars: { justeApres: [[{ etapeTypeId: 'ssr' }]] },
  afp: { justeApres: [[{ etapeTypeId: 'ssr' }]] },
  ass: { justeApres: [[{ etapeTypeId: 'ssr' }]] },
  aof: { justeApres: [[{ etapeTypeId: 'ssr' }]] },
  agn: { justeApres: [[{ etapeTypeId: 'ssr' }]] },
  api: { justeApres: [[{ etapeTypeId: 'ssr' }]] },
  apd: {
    apres: [[{ etapeTypeId: 'scl' }]],
    justeApres: [
      [{ etapeTypeId: 'cps' }],
      [{ etapeTypeId: 'apo', statutId: 'ajo' }]
    ]
  },
  spo: {
    justeApres: [[{ etapeTypeId: 'apd' }]]
  },
  apo: {
    justeApres: [[{ etapeTypeId: 'spo' }]]
  },
  sas: {
    justeApres: [
      [{ etapeTypeId: 'apo', statutId: 'fav' }],
      [{ etapeTypeId: 'apo', statutId: 'def' }]
    ]
  },
  dex: {
    justeApres: [[{ etapeTypeId: 'sas' }]],
    separation: []
  },
  mno: {
    justeApres: [[{ etapeTypeId: 'dex' }]],
    avant: [
      [{ etapeTypeId: 'abd' }],
      [{ etapeTypeId: 'rtd' }],
      [{ etapeTypeId: 'and' }]
    ]
  },
  rpu: {
    justeApres: [[{ etapeTypeId: 'dex' }]],
    avant: [
      [{ etapeTypeId: 'abd' }],
      [{ etapeTypeId: 'rtd' }],
      [{ etapeTypeId: 'and' }]
    ]
  },
  pqr: {
    justeApres: [[{ etapeTypeId: 'dex' }]],
    avant: [
      [{ etapeTypeId: 'abd' }],
      [{ etapeTypeId: 'rtd' }],
      [{ etapeTypeId: 'and' }]
    ]
  },
  ncl: {
    justeApres: [[{ etapeTypeId: 'dex' }]],
    avant: [
      [{ etapeTypeId: 'abd' }],
      [{ etapeTypeId: 'rtd' }],
      [{ etapeTypeId: 'and' }]
    ]
  },
  abd: {
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
  rtd: {
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
  and: {
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
  dim: {
    justeApres: [[{ etapeTypeId: 'mdp' }]]
  },
  css: {
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
  des: {
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
}

export { restrictionsAxmOct }
