import { ITitre } from '../../../types'

const titresDemarchesPublicModifie = ([
  {
    typeId: 'cxh',
    demarches: [
      {
        id: 'h-cx-courdemanges-1988-oct01',
        titreId: 'h-cx-courdemanges-1988',
        typeId: 'oct',
        statutId: 'acc',
        ordre: 1,
        type: { etapesTypes: [{ id: 'dpu', titreTypeId: 'cxh' }] },
        publicLecture: true,
        entrepriseLecture: true
      }
    ]
  }
] as unknown) as ITitre[]

const titresDemarchesPublicIdentique = ([
  {
    typeId: 'cxh',
    demarches: [
      {
        id: 'h-cx-courdemanges-1988-oct01',
        titreId: 'h-cx-courdemanges-1988',
        typeId: 'oct',
        statutId: 'rej',
        ordre: 1,
        type: { etapesTypes: [{ id: 'dpu', titreTypeId: 'prw' }] },
        etapes: [
          {
            id: 'h-cx-courdemanges-1988-oct01-dex01',
            titreDemarcheIdId: 'h-cx-courdemanges-1988-oct01',
            typeId: 'dex',
            statutId: 'rej',
            ordre: 1,
            date: '1988-03-06',
            dateFin: '2013-03-11'
          }
        ],
        publicLecture: false,
        entrepriseLecture: false
      }
    ]
  }
] as unknown) as ITitre[]

export {
  titresDemarchesPublicModifie,
  titresDemarchesPublicIdentique
}
