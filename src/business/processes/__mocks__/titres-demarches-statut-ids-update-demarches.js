const titresDemarchesStatutModifie = [
  {
    demarches: [
      {
        id: 'h-cxx-courdemanges-1988-oct01',
        titreId: 'h-cxx-courdemanges-1988',
        typeId: 'oct',
        statutId: 'rej',
        ordre: 1,
        etapes: [
          {
            id: 'h-cxx-courdemanges-1988-oct01-dpu01',
            titreDemarcheIdId: 'h-cxx-courdemanges-1988-oct01',
            typeId: 'dpu',
            statutId: 'acc',
            ordre: 2,
            date: '1988-03-11T23:00:00.000Z'
          },
          {
            id: 'h-cxx-courdemanges-1988-oct01-dex01',
            titreDemarcheIdId: 'h-cxx-courdemanges-1988-oct01',
            typeId: 'dex',
            statutId: 'acc',
            ordre: 1,
            date: '1988-03-06T23:00:00.000Z',
            dateFin: '2013-03-11T23:00:00.000Z'
          }
        ]
      }
    ]
  }
]

const titresDemarchesStatutIdentique = [
  {
    demarches: [
      {
        id: 'h-cxx-courdemanges-1988-oct01',
        titreId: 'h-cxx-courdemanges-1988',
        typeId: 'oct',
        statutId: 'acc',
        ordre: 1,
        etapes: [
          {
            id: 'h-cxx-courdemanges-1988-oct01-dpu01',
            titreDemarcheIdId: 'h-cxx-courdemanges-1988-oct01',
            typeId: 'dpu',
            statutId: 'acc',
            ordre: 2,
            date: '1988-03-11T23:00:00.000Z'
          },
          {
            id: 'h-cxx-courdemanges-1988-oct01-dex01',
            titreDemarcheIdId: 'h-cxx-courdemanges-1988-oct01',
            typeId: 'dex',
            statutId: 'acc',
            ordre: 1,
            date: '1988-03-06T23:00:00.000Z',
            dateFin: '2013-03-11T23:00:00.000Z'
          }
        ]
      }
    ]
  }
]

export { titresDemarchesStatutModifie, titresDemarchesStatutIdentique }
