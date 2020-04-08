import { ITitreDemarche } from '../../../types'

const titresDemarchesEtapes = [
  {
    etapes: [
      { ordre: 1, date: '1988-03-06' },
      { ordre: 1, date: '1988-03-08' }
    ],
    titre: null
  }
] as ITitreDemarche[]

const titresDemarchesEtapesVides = ([
  {
    etapes: [],
    titre: { typeId: '' }
  }
] as unknown) as ITitreDemarche[]

export { titresDemarchesEtapes, titresDemarchesEtapesVides }
