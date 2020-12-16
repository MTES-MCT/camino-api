import { IEtatIdDefinition } from '../demarches-etats-definitions'
import { etatComplementsGet } from '../etat-cycles'

// https://cacoo.com/diagrams/mdAnl7m9V2ViBlxA/C4063

// fixme pourquoi il y a des doubles barres ?
const etatsDefinitionPrmOct: IEtatIdDefinition[] = [
  {
    etatId: 'mfr',
    justeApres: [[]]
  },
  {
    etatId: 'nis',
    justeApres: []
  },
  // fixme j’ai pas compris les 2 mod/mif
  {
    etatId: 'mdp',
    justeApres: [[{ etatId: 'mfr' }]]
  },
  {
    etatId: 'spp',
    justeApres: [[{ etatId: 'mdp' }]]
  },
  // fixme j’ai fait un cycle de complement normal
  ...etatComplementsGet({
    etatId: 'mcr',
    justeApres: [[{ etatId: 'spp' }]]
  }),
  {
    etatId: 'anf',
    justeApres: [[{ etatId: 'mcr', statutId: 'fav' }]]
  },
  {
    etatId: 'mec',
    separation: ['scg'],
    justeApres: [[{ etatId: 'anf' }]]
  },
  {
    etatId: 'scl',
    separation: ['spo'],
    justeApres: [[{ etatId: 'mec' }]]
  },
  { etatId: 'ama', justeApres: [[{ etatId: 'scl' }]] },
  { etatId: 'aep', justeApres: [[{ etatId: 'scl' }]] },
  { etatId: 'acl', justeApres: [[{ etatId: 'scl' }]] },
  {
    etatId: 'ssr',
    separation: ['spo'],
    justeApres: [[{ etatId: 'mec' }]]
  },
  { etatId: 'apl', justeApres: [[{ etatId: 'ssr' }]] },
  { etatId: 'apm', justeApres: [[{ etatId: 'ssr' }]] },
  { etatId: 'pnr', justeApres: [[{ etatId: 'ssr' }]] },
  { etatId: 'apn', justeApres: [[{ etatId: 'ssr' }]] },
  { etatId: 'aof', justeApres: [[{ etatId: 'ssr' }]] },
  { etatId: 'aop', justeApres: [[{ etatId: 'ssr' }]] },

  // fixme il faut quoi pour faire une spo ?
  { etatId: 'spo', justeApres: [[{ etatId: 'ssr' }]] },
  { etatId: 'apo', justeApres: [[{ etatId: 'spo' }]] },
  { etatId: 'apd', justeApres: [[{ etatId: 'apo' }]] },
  { etatId: 'app', justeApres: [[{ etatId: 'apd' }]] },
  {
    etatId: 'ppu',
    justeApres: [[{ etatId: 'mec' }]]
  },
  { etatId: 'ppc', justeApres: [[{ etatId: 'ppu' }]] },
  // fixme c’est quoi les cases grises ?
  {
    etatId: 'scg',
    justeApres: [[{ etatId: 'app' }, { etatId: 'ppc' }]]
  },
  {
    etatId: 'rcg',
    justeApres: [[{ etatId: 'scg' }]]
  },
  { etatId: 'acg', justeApres: [[{ etatId: 'rcg' }]] },
  { etatId: 'sas', justeApres: [[{ etatId: 'acg' }]] },
  { etatId: 'dex', justeApres: [[{ etatId: 'sas' }]] },
  {
    etatId: 'dpu',
    justeApres: [[{ etatId: 'dex', statutId: 'fav' }]]
  },
  {
    etatId: 'npp',
    separation: [],
    justeApres: [
      [{ etatId: 'dex', statutId: 'def' }],
      [{ etatId: 'dpu', statutId: 'fav' }]
    ]
  },
  // FIXME gérer la //
  { etatId: 'mno-npp', justeApres: [[{ etatId: 'npp' }]] },
  {
    etatId: 'rpu',
    justeApres: [[{ etatId: 'npp', statutId: 'fav' }]]
  },
  {
    etatId: 'ncl',
    justeApres: [[{ etatId: 'npp', statutId: 'fav' }]]
  },
  {
    etatId: 'pqr',
    justeApres: [[{ etatId: 'npp', statutId: 'fav' }]]
  },
  { etatId: 'dim', justeApres: [[{ etatId: 'mdp' }]] },
  // fixme C’est du // ?
  {
    etatId: 'and',
    justeApres: [[{ etatId: 'dim' }], [{ etatId: 'dex' }]]
  },
  { etatId: 'abd', justeApres: [[{ etatId: 'dex' }]] },
  { etatId: 'rtd', justeApres: [[{ etatId: 'dex' }]] },
  {
    etatId: 'des',
    justeApres: [[]],
    avant: [[{ etatId: 'dex' }], [{ etatId: 'css' }], [{ etatId: 'dim' }]],
    apres: [[{ etatId: 'mdp' }]]
  },
  {
    etatId: 'css',
    justeApres: [[]],
    avant: [[{ etatId: 'dex' }], [{ etatId: 'des' }], [{ etatId: 'dim' }]],
    apres: [[{ etatId: 'mdp' }]]
  }
]

export { etatsDefinitionPrmOct }
