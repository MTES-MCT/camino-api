const titreDemarches = [
  {
    id: 'h-cx-courdemanges-1988-oct01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    ordre: 1,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-oct01-dpu01',
        titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '1988-03-11'
      },
      {
        id: 'h-cx-courdemanges-1988-oct01-dex01',
        titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06',
        dateFin: '2013-03-11'
      }
    ]
  },
  {
    id: 'h-cx-courdemanges-1988-pro01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'pro',
    statutId: 'acc',
    ordre: 2,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-pro01-dex01',
        titreDemarcheId: 'h-cx-courdemanges-1988-pro01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '2013-05-21',
        dateFin: '2038-03-11',
        duree: 25
      }
    ]
  }
]

export { titreDemarches }
