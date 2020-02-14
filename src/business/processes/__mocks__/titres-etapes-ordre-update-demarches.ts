import { ITitresDemarches } from '../../../types'

const titresDemarchesEtapes = [
  {
    etapes: [
      { ordre: 1, date: '1988-03-06' },
      { ordre: 1, date: '1988-03-08' }
    ]
  }
] as ITitresDemarches[]

const titresDemarchesEtapesVides = ([
  {
    etapes: []
  }
] as unknown) as ITitresDemarches[]

export { titresDemarchesEtapes, titresDemarchesEtapesVides }
