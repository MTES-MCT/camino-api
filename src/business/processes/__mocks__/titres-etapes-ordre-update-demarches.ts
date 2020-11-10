import TitresDemarches from '../../../database/models/titres-demarches'

const titresDemarchesEtapes = [
  {
    etapes: [
      { ordre: 1, date: '1988-03-06' },
      { ordre: 1, date: '1988-03-08' }
    ],
    titre: null
  } as TitresDemarches
]

const titresDemarchesEtapesVides = [
  ({ etapes: [], titre: { typeId: '' } } as unknown) as TitresDemarches
]

export { titresDemarchesEtapes, titresDemarchesEtapesVides }
