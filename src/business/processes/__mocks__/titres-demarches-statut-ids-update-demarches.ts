import { ITitre } from '../../../types'

const titresDemarchesStatutModifie = ([
  {
    demarches: [
      {
        id: 'h-cx-courdemanges-1988-oct01',
        titreId: 'h-cx-courdemanges-1988',
        typeId: 'oct',
        statutId: 'rej',
        ordre: 1,
        etapes: [
          {
            id: 'h-cx-courdemanges-1988-oct01-dpu01',
            titreDemarcheIdId: 'h-cx-courdemanges-1988-oct01',
            typeId: 'dpu',
            statutId: 'acc',
            ordre: 2,
            date: '1988-03-11'
          },
          {
            id: 'h-cx-courdemanges-1988-oct01-dex01',
            titreDemarcheIdId: 'h-cx-courdemanges-1988-oct01',
            typeId: 'dex',
            statutId: 'acc',
            ordre: 1,
            date: '1988-03-06',
            dateFin: '2013-03-11'
          }
        ]
      }
    ]
  }
] as unknown) as ITitre[]

const titresDemarchesStatutIdentique = ([
  {
    demarches: [
      {
        id: 'h-cx-courdemanges-1988-oct01',
        titreId: 'h-cx-courdemanges-1988',
        typeId: 'oct',
        statutId: 'acc',
        ordre: 1,
        etapes: [
          {
            id: 'h-cx-courdemanges-1988-oct01-dpu01',
            titreDemarcheIdId: 'h-cx-courdemanges-1988-oct01',
            typeId: 'dpu',
            statutId: 'acc',
            ordre: 2,
            date: '1988-03-11'
          },
          {
            id: 'h-cx-courdemanges-1988-oct01-dex01',
            titreDemarcheIdId: 'h-cx-courdemanges-1988-oct01',
            typeId: 'dex',
            statutId: 'acc',
            ordre: 1,
            date: '1988-03-06',
            dateFin: '2013-03-11'
          }
        ]
      }
    ]
  }
] as unknown) as ITitre[]

export { titresDemarchesStatutModifie, titresDemarchesStatutIdentique }
