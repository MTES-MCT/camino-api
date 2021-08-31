import { IDemarcheDefinitionRestrictions } from '../definitions'
import { etatComplementsGet, etatInformationsGet } from '../etat-cycles'

// https://cacoo.com/diagrams/nStw2pYe0PKBs1lp/B1B05
const restrictionsArmRenPro: IDemarcheDefinitionRestrictions = {
  mfr: {
    justeApres: []
  },
  mdp: {
    justeApres: [[{ etapeTypeId: 'mfr' }]],
    separation: ['mcr']
  },
  mod: {
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
  aco: {
    justeApres: [
      [{ etapeTypeId: 'aof', statutId: 'fav' }],
      [{ etapeTypeId: 'mnv' }]
    ]
  },
  mnv: {
    justeApres: [[{ etapeTypeId: 'aco' }]]
  },
  mnd: {
    justeApres: [[{ etapeTypeId: 'aof', statutId: 'def' }]]
  },
  css: {
    justeApres: [[{ etapeTypeId: 'mcr', statutId: 'def' }]]
  },
  mnc: {
    justeApres: [[{ etapeTypeId: 'css' }]]
  },
  des: {
    justeApres: [],
    apres: [[{ etapeTypeId: 'mdp' }]],
    avant: [[{ etapeTypeId: 'css' }], [{ etapeTypeId: 'aof' }]]
  }
}

export { restrictionsArmRenPro }
