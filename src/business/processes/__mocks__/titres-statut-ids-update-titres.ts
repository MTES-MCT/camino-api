import Titres from '../../../database/models/titres'

const titresValideStatutIdAJour = [
  {
    id: 'm-pr-saint-pierre-2014',
    statutId: 'val',
    demarches: [
      {
        id: 'm-pr-saint-pierre-2014-oct01',
        titreId: 'm-pr-saint-pierre-2014',
        type: { id: 'oct' },
        typeId: 'oct',
        statutId: 'acc',
        ordre: 1,
        etapes: [
          {
            id: 'm-pr-saint-pierre-2014-oct01-dex01',
            titreDemarcheId: 'm-pr-saint-pierre-2014-oct01',
            typeId: 'dex',
            statutId: 'acc',
            ordre: 1,
            date: '2014-04-01',
            dateDebut: null,
            dateFin: '3014-04-01'
          }
        ]
      }
    ]
  } as Titres
]

const titresEchuStatutIdObselete = [
  {
    id: 'm-pr-saint-pierre-1914',
    statutId: 'val',
    demarches: [
      {
        id: 'm-pr-saint-pierre-1914-oct01',
        titreId: 'm-pr-saint-pierre-1914',
        type: { id: 'oct' },
        typeId: 'oct',
        statutId: 'acc',
        ordre: 1,
        etapes: [
          {
            id: 'm-pr-saint-pierre-2014-oct01-dex01',
            titreDemarcheId: 'm-pr-saint-pierre-2014-oct01',
            typeId: 'dex',
            statutId: 'acc',
            ordre: 1,
            date: '1014-04-01',
            dateDebut: null,
            dateFin: '2014-04-01'
          }
        ]
      }
    ]
  } as Titres
]

export { titresValideStatutIdAJour, titresEchuStatutIdObselete }
