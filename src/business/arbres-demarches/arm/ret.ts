import { IArbreEtape } from '../arbres-demarches'
import { arbreInformationsGet } from '../arbres-annexes'

// https://cacoo.com/diagrams/VxMVdNkolhMQbKtv/B1B05
const arbreArmRet: IArbreEtape[] = [
  {
    arbreTypeId: 'ide',
    justeApres: []
  },
  {
    arbreTypeId: 'mno-ide',
    justeApres: [[{ arbreTypeId: 'ide' }]]
  },
  {
    arbreTypeId: 'aof',
    justeApres: [[{ arbreTypeId: 'mno-ide' }], [{ arbreTypeId: 'eof' }]]
  },
  {
    arbreTypeId: 'rif-mno',
    justeApres: [[{ arbreTypeId: 'mno-ide' }]]
  },
  ...arbreInformationsGet({
    arbreTypeId: 'eof',
    justeApres: [[{ arbreTypeId: 'rif-mno' }]]
  }),
  {
    arbreTypeId: 'css',
    apres: [[{ arbreTypeId: 'mno-ide' }]],
    avant: [[{ arbreTypeId: 'aof' }]],
    justeApres: []
  },
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
    arbreTypeId: 'mno-css',
    justeApres: [
      [{ arbreTypeId: 'aof', statutId: 'def' }],
      [{ arbreTypeId: 'css' }]
    ]
  }
]

export { arbreArmRet }
