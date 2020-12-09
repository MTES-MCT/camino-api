import { IArbreEtape } from '../arbres-demarches'
import { arbreComplementsGet } from '../arbres-annexes'

// https://cacoo.com/diagrams/mdAnl7m9V2ViBlxA/C4063

// fixme pourquoi il y a des doubles barres ?
const arbrePrmOct: IArbreEtape[] = [
  {
    arbreTypeId: 'mfr',
    justeApres: [[]]
  },
  // fixme j’ai pas compris les 2 mod/mif
  {
    arbreTypeId: 'mdp',
    justeApres: [[{ arbreTypeId: 'mfr' }]]
  },
  {
    arbreTypeId: 'spp',
    justeApres: [[{ arbreTypeId: 'mdp' }]]
  },
  // fixme j’ai fait un cycle de complement normal
  ...arbreComplementsGet({
    arbreTypeId: 'mcr',
    justeApres: [[{ arbreTypeId: 'spp' }]]
  }),
  {
    arbreTypeId: 'anf',
    justeApres: [[{ arbreTypeId: 'mcr', statutId: 'fav' }]]
  },
  {
    arbreTypeId: 'mec',
    separation: ['scg'],
    justeApres: [[{ arbreTypeId: 'anf' }]]
  },
  {
    arbreTypeId: 'scl',
    separation: ['spo'],
    justeApres: [[{ arbreTypeId: 'mec' }]]
  },
  { arbreTypeId: 'ama', justeApres: [[{ arbreTypeId: 'scl' }]] },
  { arbreTypeId: 'aep', justeApres: [[{ arbreTypeId: 'scl' }]] },
  { arbreTypeId: 'acl', justeApres: [[{ arbreTypeId: 'scl' }]] },
  {
    arbreTypeId: 'ssr',
    separation: ['spo'],
    justeApres: [[{ arbreTypeId: 'mec' }]]
  },
  { arbreTypeId: 'apl', justeApres: [[{ arbreTypeId: 'ssr' }]] },
  { arbreTypeId: 'apm', justeApres: [[{ arbreTypeId: 'ssr' }]] },
  { arbreTypeId: 'pnr', justeApres: [[{ arbreTypeId: 'ssr' }]] },
  { arbreTypeId: 'apn', justeApres: [[{ arbreTypeId: 'ssr' }]] },
  { arbreTypeId: 'aof', justeApres: [[{ arbreTypeId: 'ssr' }]] },
  { arbreTypeId: 'aop', justeApres: [[{ arbreTypeId: 'ssr' }]] },

  // fixme il faut quoi pour faire une spo ?
  { arbreTypeId: 'spo', justeApres: [[{ arbreTypeId: 'ssr' }]] },
  { arbreTypeId: 'apo', justeApres: [[{ arbreTypeId: 'spo' }]] },
  { arbreTypeId: 'apd', justeApres: [[{ arbreTypeId: 'apo' }]] },
  { arbreTypeId: 'app', justeApres: [[{ arbreTypeId: 'apd' }]] },
  {
    arbreTypeId: 'ppu',
    justeApres: [[{ arbreTypeId: 'mec' }]]
  },
  // fixme c’est quoi les cases grises ?
  {
    arbreTypeId: 'scg',
    justeApres: [[{ arbreTypeId: 'app' }, { arbreTypeId: 'ppu' }]]
  },
  {
    arbreTypeId: 'rcg',
    justeApres: [[{ arbreTypeId: 'scg' }]]
  },
  { arbreTypeId: 'acg', justeApres: [[{ arbreTypeId: 'rcg' }]] },
  { arbreTypeId: 'sas', justeApres: [[{ arbreTypeId: 'acg' }]] },
  { arbreTypeId: 'dex', justeApres: [[{ arbreTypeId: 'sas' }]] },
  {
    arbreTypeId: 'dpu',
    justeApres: [[{ arbreTypeId: 'dex', statutId: 'fav' }]]
  },
  {
    arbreTypeId: 'npp',
    justeApres: [
      [{ arbreTypeId: 'dex', statutId: 'def' }],
      [{ arbreTypeId: 'dpu', statutId: 'fav' }]
    ]
  },
  // FIXME gérer la //
  { arbreTypeId: 'mno-npp', justeApres: [[{ arbreTypeId: 'npp' }]] },
  {
    arbreTypeId: 'rpu',
    justeApres: [[{ arbreTypeId: 'npp', statutId: 'fav' }]]
  },
  {
    arbreTypeId: 'ncl',
    justeApres: [[{ arbreTypeId: 'npp', statutId: 'fav' }]]
  },
  {
    arbreTypeId: 'pqr',
    justeApres: [[{ arbreTypeId: 'npp', statutId: 'fav' }]]
  },
  { arbreTypeId: 'dim', justeApres: [[{ arbreTypeId: 'mdp' }]] },
  // fixme C’est du // ?
  {
    arbreTypeId: 'and',
    justeApres: [[{ arbreTypeId: 'dim' }], [{ arbreTypeId: 'dex' }]]
  },
  { arbreTypeId: 'abd', justeApres: [[{ arbreTypeId: 'dex' }]] },
  { arbreTypeId: 'rtd', justeApres: [[{ arbreTypeId: 'dex' }]] },
  {
    arbreTypeId: 'des',
    justeApres: [[]],
    avant: [
      [{ arbreTypeId: 'dex' }, { arbreTypeId: 'css' }, { arbreTypeId: 'dim' }]
    ],
    apres: [[{ arbreTypeId: 'mdp' }]]
  },
  {
    arbreTypeId: 'css',
    justeApres: [[]],
    avant: [
      [{ arbreTypeId: 'dex' }, { arbreTypeId: 'des' }, { arbreTypeId: 'dim' }]
    ],
    apres: [[{ arbreTypeId: 'mdp' }]]
  }
]

// Fixme dans TDE il manque "ihi", "nis" et "ppc" (cloture de la participation du public)

export { arbrePrmOct }
