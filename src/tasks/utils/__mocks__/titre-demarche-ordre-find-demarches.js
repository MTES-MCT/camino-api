const titreDemarches = [
  {
    id: 'h-cxx-courdemanges-1988-oct01',
    titreId: 'h-cxx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    ordre: 1,
    etapes: [
      {
        id: 'h-cxx-courdemanges-1988-oct01-dpu01',
        titreDemarcheId: 'h-cxx-courdemanges-1988-oct01',
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '1988-03-11T23:00:00.000Z'
      },
      {
        id: 'h-cxx-courdemanges-1988-oct01-dex01',
        titreDemarcheId: 'h-cxx-courdemanges-1988-oct01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06T23:00:00.000Z',
        dateFin: '2013-03-11T23:00:00.000Z'
      }
    ]
  },
  {
    id: 'h-cxx-courdemanges-1988-pro01',
    titreId: 'h-cxx-courdemanges-1988',
    typeId: 'pro',
    statutId: 'acc',
    ordre: 2,
    etapes: [
      {
        id: 'h-cxx-courdemanges-1988-pro01-dex01',
        titreDemarcheId: 'h-cxx-courdemanges-1988-pro01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '2013-05-21T22:00:00.000Z',
        dateFin: '2038-03-11T23:00:00.000Z',
        duree: 25
      }
    ]
  }
]

export { titreDemarches }
