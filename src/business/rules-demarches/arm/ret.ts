import { IDemarcheDefinitionRestrictions } from '../definitions'
import { etatInformationsGet } from '../etat-cycles'

// https://cacoo.com/diagrams/VxMVdNkolhMQbKtv/B1B05
const restrictionsArmRet: IDemarcheDefinitionRestrictions = {
  ide: {
    justeApres: []
  },
  mni: {
    justeApres: [[{ etapeTypeId: 'ide' }]]
  },
  aof: {
    justeApres: [[{ etapeTypeId: 'mni' }], [{ etapeTypeId: 'eof' }]]
  },
  rif: {
    justeApres: [[{ etapeTypeId: 'mni' }]]
  },
  ...etatInformationsGet('mio', 'rio', {
    etapeTypeId: 'eof',
    justeApres: [[{ etapeTypeId: 'rif' }]]
  }),
  css: {
    apres: [[{ etapeTypeId: 'mni' }]],
    avant: [[{ etapeTypeId: 'aof' }]],
    justeApres: [],
    final: true
  },
  aco: {
    justeApres: [
      [{ etapeTypeId: 'aof', statutId: 'fav' }],
      [{ etapeTypeId: 'mnv' }]
    ]
  },
  mnv: {
    justeApres: [[{ etapeTypeId: 'aco' }]]
  },
  mnc: {
    justeApres: [
      [{ etapeTypeId: 'aof', statutId: 'def' }],
      [{ etapeTypeId: 'css' }]
    ]
  }
}

export { restrictionsArmRet }
