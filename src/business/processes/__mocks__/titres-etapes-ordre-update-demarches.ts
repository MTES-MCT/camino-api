import { ITitreDemarche } from '../../../types'

const titresDemarchesEtapes = [
  {
    etapes: [
      { ordre: 1, date: '1988-03-06' },
      { ordre: 1, date: '1988-03-08' }
    ]
  }
] as ITitreDemarche[]

const titresDemarchesEtapesVides = ([
  {
    etapes: []
  }
] as unknown) as ITitreDemarche[]

export { titresDemarchesEtapes, titresDemarchesEtapesVides }
