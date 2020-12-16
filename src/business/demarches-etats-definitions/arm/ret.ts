import { IEtatIdDefinition } from '../demarches-etats-definitions'
import { etatInformationsGet } from '../etat-cycles'

// https://cacoo.com/diagrams/VxMVdNkolhMQbKtv/B1B05
const etatsDefinitionArmRet: IEtatIdDefinition[] = [
  {
    etatId: 'ide',
    justeApres: []
  },
  {
    etatId: 'mno-ide',
    justeApres: [[{ etatId: 'ide' }]]
  },
  {
    etatId: 'aof',
    justeApres: [[{ etatId: 'mno-ide' }], [{ etatId: 'eof' }]]
  },
  {
    etatId: 'rif-mno',
    justeApres: [[{ etatId: 'mno-ide' }]]
  },
  ...etatInformationsGet({
    etatId: 'eof',
    justeApres: [[{ etatId: 'rif-mno' }]]
  }),
  {
    etatId: 'css',
    apres: [[{ etatId: 'mno-ide' }]],
    avant: [[{ etatId: 'aof' }]],
    justeApres: []
  },
  {
    etatId: 'aco',
    justeApres: [[{ etatId: 'aof', statutId: 'fav' }], [{ etatId: 'mno-aco' }]]
  },
  {
    etatId: 'mno-aco',
    justeApres: [[{ etatId: 'aco' }]]
  },
  {
    etatId: 'mno-css',
    justeApres: [[{ etatId: 'aof', statutId: 'def' }], [{ etatId: 'css' }]]
  }
]

export { etatsDefinitionArmRet }
