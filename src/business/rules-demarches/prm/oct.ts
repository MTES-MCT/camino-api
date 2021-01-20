import { IEtapeTypeIdDefinition } from '../definitions'
import { etatComplementsGet } from '../etat-cycles'

// https://cacoo.com/diagrams/mdAnl7m9V2ViBlxA/C4063

// fixme pourquoi il y a des doubles barres ?
const etatsDefinitionPrmOct: IEtapeTypeIdDefinition[] = [
  {
    etapeTypeId: 'mfr',
    justeApres: [[]]
  },
  {
    etapeTypeId: 'nis',
    justeApres: []
  },
  // fixme j’ai pas compris les 2 mod/mif
  {
    etapeTypeId: 'mdp',
    justeApres: [[{ etapeTypeId: 'mfr' }]]
  },
  {
    etapeTypeId: 'spp',
    justeApres: [[{ etapeTypeId: 'mdp' }]]
  },
  // fixme j’ai fait un cycle de complement normal
  ...etatComplementsGet('mca', 'rca', {
    etapeTypeId: 'mcr',
    justeApres: [[{ etapeTypeId: 'spp' }]]
  }),
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
  { etapeTypeId: 'ama', justeApres: [[{ etapeTypeId: 'scl' }]] },
  { etapeTypeId: 'aep', justeApres: [[{ etapeTypeId: 'scl' }]] },
  { etapeTypeId: 'acl', justeApres: [[{ etapeTypeId: 'scl' }]] },
  {
    etapeTypeId: 'ssr',
    separation: ['spo'],
    justeApres: [[{ etapeTypeId: 'mec' }]]
  },
  { etapeTypeId: 'apl', justeApres: [[{ etapeTypeId: 'ssr' }]] },
  { etapeTypeId: 'apm', justeApres: [[{ etapeTypeId: 'ssr' }]] },
  { etapeTypeId: 'pnr', justeApres: [[{ etapeTypeId: 'ssr' }]] },
  { etapeTypeId: 'apn', justeApres: [[{ etapeTypeId: 'ssr' }]] },
  { etapeTypeId: 'aof', justeApres: [[{ etapeTypeId: 'ssr' }]] },
  { etapeTypeId: 'aop', justeApres: [[{ etapeTypeId: 'ssr' }]] },

  // fixme il faut quoi pour faire une spo ?
  { etapeTypeId: 'spo', justeApres: [[{ etapeTypeId: 'ssr' }]] },
  { etapeTypeId: 'apo', justeApres: [[{ etapeTypeId: 'spo' }]] },
  { etapeTypeId: 'apd', justeApres: [[{ etapeTypeId: 'apo' }]] },
  { etapeTypeId: 'app', justeApres: [[{ etapeTypeId: 'apd' }]] },
  {
    etapeTypeId: 'ppu',
    justeApres: [[{ etapeTypeId: 'mec' }]]
  },
  { etapeTypeId: 'ppc', justeApres: [[{ etapeTypeId: 'ppu' }]] },
  // fixme c’est quoi les cases grises ?
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
    justeApres: [[{ etapeTypeId: 'dex', statutId: 'fav' }]]
  },
  {
    etapeTypeId: 'npp',
    separation: [],
    justeApres: [
      [{ etapeTypeId: 'dex', statutId: 'def' }],
      [{ etapeTypeId: 'dpu', statutId: 'fav' }]
    ]
  },
  // FIXME gérer la //
  { etapeTypeId: 'mno', justeApres: [[{ etapeTypeId: 'npp' }]] },
  {
    etapeTypeId: 'rpu',
    justeApres: [[{ etapeTypeId: 'npp', statutId: 'fav' }]]
  },
  {
    etapeTypeId: 'ncl',
    justeApres: [[{ etapeTypeId: 'npp', statutId: 'fav' }]]
  },
  {
    etapeTypeId: 'pqr',
    justeApres: [[{ etapeTypeId: 'npp', statutId: 'fav' }]]
  },
  { etapeTypeId: 'dim', justeApres: [[{ etapeTypeId: 'mdp' }]] },
  // fixme C’est du // ?
  {
    etapeTypeId: 'and',
    justeApres: [[{ etapeTypeId: 'dim' }], [{ etapeTypeId: 'dex' }]]
  },
  { etapeTypeId: 'abd', justeApres: [[{ etapeTypeId: 'dex' }]] },
  { etapeTypeId: 'rtd', justeApres: [[{ etapeTypeId: 'dex' }]] },
  {
    etapeTypeId: 'des',
    justeApres: [[]],
    avant: [
      [{ etapeTypeId: 'dex' }],
      [{ etapeTypeId: 'css' }],
      [{ etapeTypeId: 'dim' }]
    ],
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
    apres: [[{ etapeTypeId: 'mdp' }]]
  }
]

export { etatsDefinitionPrmOct }
