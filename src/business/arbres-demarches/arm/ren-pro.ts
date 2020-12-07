import { IArbreEtape } from '../arbres-demarches'
import { arbreComplementsGet, arbreInformationsGet } from '../arbres-annexes'

// https://cacoo.com/diagrams/nStw2pYe0PKBs1lp/B1B05
const arbreArmRenPro: IArbreEtape[] = [
  {
    arbreTypeId: 'mfr',
    justeApres: []
  },
  {
    arbreTypeId: 'mdp',
    justeApres: [[{ arbreTypeId: 'mfr' }]],
    separation: ['mcr']
  },
  {
    arbreTypeId: 'mod',
    justeApres: [[{ arbreTypeId: 'mdp' }]]
  },
  ...arbreComplementsGet({
    arbreTypeId: 'mcr',
    justeApres: [[{ arbreTypeId: 'mdp' }], [{ arbreTypeId: 'mod' }]]
  }),
  ...arbreInformationsGet({
    arbreTypeId: 'eof',
    justeApres: [[{ arbreTypeId: 'mcr', statutId: 'fav' }]]
  }),
  ...arbreInformationsGet({
    arbreTypeId: 'aof',
    justeApres: [[{ arbreTypeId: 'eof' }]]
  }),
  {
    arbreTypeId: 'aco',
    justeApres: [
      [{ arbreTypeId: 'aof', statutId: 'fav' }],
      [{ arbreTypeId: 'mno-aco' }]
    ]
  },
  {
    arbreTypeId: 'mno-aco',
    justeApres: [[{ arbreTypeId: 'aco' }]]
  },
  {
    arbreTypeId: 'mno-rej',
    justeApres: [[{ arbreTypeId: 'aof', statutId: 'def' }]]
  },
  {
    arbreTypeId: 'css',
    justeApres: [[{ arbreTypeId: 'mcr', statutId: 'def' }]]
  },
  {
    arbreTypeId: 'mno-css',
    justeApres: [[{ arbreTypeId: 'css' }]]
  },
  {
    arbreTypeId: 'des',
    justeApres: [],
    apres: [[{ arbreTypeId: 'mdp' }]],
    avant: [[{ arbreTypeId: 'css' }], [{ arbreTypeId: 'aof' }]]
  }
]

export { arbreArmRenPro }
