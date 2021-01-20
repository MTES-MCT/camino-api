import { IEtapeTypeIdDefinition } from '../definitions'
import { etatInformationsGet } from '../etat-cycles'

// https://cacoo.com/diagrams/VxMVdNkolhMQbKtv/B1B05
const etatsDefinitionArmRet: IEtapeTypeIdDefinition[] = [
  {
    etapeTypeId: 'ide',
    justeApres: []
  },
  {
    etapeTypeId: 'mni',
    justeApres: [[{ etapeTypeId: 'ide' }]]
  },
  {
    etapeTypeId: 'aof',
    justeApres: [[{ etapeTypeId: 'mni' }], [{ etapeTypeId: 'eof' }]]
  },
  {
    etapeTypeId: 'rif',
    justeApres: [[{ etapeTypeId: 'mni' }]]
  },
  ...etatInformationsGet('mio', 'rio', {
    etapeTypeId: 'eof',
    justeApres: [[{ etapeTypeId: 'rif' }]]
  }),
  {
    etapeTypeId: 'css',
    apres: [[{ etapeTypeId: 'mni' }]],
    avant: [[{ etapeTypeId: 'aof' }]],
    justeApres: [],
    final: true
  },
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
    etapeTypeId: 'mnc',
    justeApres: [
      [{ etapeTypeId: 'aof', statutId: 'def' }],
      [{ etapeTypeId: 'css' }]
    ]
  }
]

export { etatsDefinitionArmRet }
