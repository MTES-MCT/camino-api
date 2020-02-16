import { ITitre } from '../../../types'

const titresValideStatutIdAJour = ([
  {
    id: 'm-pr-saint-pierre-2014',
    statutId: 'val',
    demarches: [
      {
        id: 'm-pr-saint-pierre-2014-oct01',
        titreId: 'm-pr-saint-pierre-2014',
        typeId: 'oct',
        statutId: 'acc',
        ordre: 1,
        annulationTitreDemarcheId: null,
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
  }
] as unknown) as ITitre[]

const titresEchuStatutIdObselete = ([
  {
    id: 'm-pr-saint-pierre-1914',
    statutId: 'val',
    demarches: [
      {
        id: 'm-pr-saint-pierre-1914-oct01',
        titreId: 'm-pr-saint-pierre-1914',
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
  }
] as unknown) as ITitre[]

export { titresValideStatutIdAJour, titresEchuStatutIdObselete }
