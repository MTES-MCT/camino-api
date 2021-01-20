import { IDemarcheDefinitionRestrictions } from '../definitions'
import { etatComplementsGet, etatInformationsGet } from '../etat-cycles'

// https://cacoo.com/diagrams/nStw2pYe0PKBs1lp/B1B05
const restrictionsArmRenPro: IDemarcheDefinitionRestrictions[] = [
  {
    etapeTypeId: 'mfr',
    justeApres: []
  },
  {
    etapeTypeId: 'mdp',
    justeApres: [[{ etapeTypeId: 'mfr' }]],
    separation: ['mcr']
  },
  {
    etapeTypeId: 'mod',
    justeApres: [[{ etapeTypeId: 'mdp' }]]
  },
  ...etatComplementsGet('mca', 'rca', {
    etapeTypeId: 'mcr',
    justeApres: [[{ etapeTypeId: 'mdp' }], [{ etapeTypeId: 'mod' }]]
  }),
  ...etatInformationsGet('mio', 'rio', {
    etapeTypeId: 'eof',
    justeApres: [[{ etapeTypeId: 'mcr', statutId: 'fav' }]]
  }),
  ...etatInformationsGet('mia', 'ria', {
    etapeTypeId: 'aof',
    justeApres: [[{ etapeTypeId: 'eof' }]]
  }),
  {
    etapeTypeId: 'aco',
    justeApres: [
      [{ etapeTypeId: 'aof', statutId: 'fav' }],
      [{ etapeTypeId: 'mnv' }]
    ]
  },
  {
    etapeTypeId: 'mnv',
    justeApres: [[{ etapeTypeId: 'aco' }]]
  },
  {
    etapeTypeId: 'mnd',
    justeApres: [[{ etapeTypeId: 'aof', statutId: 'def' }]]
  },
  {
    etapeTypeId: 'css',
    justeApres: [[{ etapeTypeId: 'mcr', statutId: 'def' }]]
  },
  {
    etapeTypeId: 'mnc',
    justeApres: [[{ etapeTypeId: 'css' }]]
  },
  {
    etapeTypeId: 'des',
    justeApres: [],
    apres: [[{ etapeTypeId: 'mdp' }]],
    avant: [[{ etapeTypeId: 'css' }], [{ etapeTypeId: 'aof' }]]
  }
]

export { restrictionsArmRenPro }
