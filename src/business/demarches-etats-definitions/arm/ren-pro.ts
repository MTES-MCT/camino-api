import { IEtatIdDefinition } from '../demarches-etats-definitions'
import { etatComplementsGet, etatInformationsGet } from '../etat-cycles'

// https://cacoo.com/diagrams/nStw2pYe0PKBs1lp/B1B05
const etatsDefinitionArmRenPro: IEtatIdDefinition[] = [
  {
    etatId: 'mfr',
    justeApres: []
  },
  {
    etatId: 'mdp',
    justeApres: [[{ etatId: 'mfr' }]],
    separation: ['mcr']
  },
  {
    etatId: 'mod',
    justeApres: [[{ etatId: 'mdp' }]]
  },
  ...etatComplementsGet({
    etatId: 'mcr',
    justeApres: [[{ etatId: 'mdp' }], [{ etatId: 'mod' }]]
  }),
  ...etatInformationsGet({
    etatId: 'eof',
    justeApres: [[{ etatId: 'mcr', statutId: 'fav' }]]
  }),
  ...etatInformationsGet({
    etatId: 'aof',
    justeApres: [[{ etatId: 'eof' }]]
  }),
  {
    etatId: 'aco',
    justeApres: [[{ etatId: 'aof', statutId: 'fav' }], [{ etatId: 'mno-aco' }]]
  },
  {
    etatId: 'mno-aco',
    justeApres: [[{ etatId: 'aco' }]]
  },
  {
    etatId: 'mno-rej',
    justeApres: [[{ etatId: 'aof', statutId: 'def' }]]
  },
  {
    etatId: 'css',
    justeApres: [[{ etatId: 'mcr', statutId: 'def' }]]
  },
  {
    etatId: 'mno-css',
    justeApres: [[{ etatId: 'css' }]]
  },
  {
    etatId: 'des',
    justeApres: [],
    apres: [[{ etatId: 'mdp' }]],
    avant: [[{ etatId: 'css' }], [{ etatId: 'aof' }]]
  }
]

export { etatsDefinitionArmRenPro }
