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
        ordre: 1,
        date: '1988-03-11T23:00:00.000Z'
      }
    ]
  }
]

const titreDemarchesDateDebut = [
  {
    id: 'h-cxx-courdemanges-1988-oct01',
    titreId: 'h-cxx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    ordre: 1,
    etapes: [
      {
        id: 'h-cxx-courdemanges-1988-oct01-dex01',
        titreDemarcheId: 'h-cxx-courdemanges-1988-oct01',
        typeId: 'rpu',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-11T23:00:00.000Z',
        dateDebut: '1988-03-15T23:00:00.000Z'
      }
    ]
  }
]

const titreDemarchesSansOctroi = [
  {
    id: 'h-cxx-courdemanges-1988-oct01',
    titreId: 'h-cxx-courdemanges-1988',
    typeId: 'mut',
    statutId: 'acc',
    ordre: 1
  }
]

const titreDemarchesSansDateDebut = [
  {
    id: 'h-cxx-courdemanges-1988-oct01',
    titreId: 'h-cxx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    ordre: 1,
    etapes: [
      {
        id: 'h-cxx-courdemanges-1988-oct01-rpu01',
        titreDemarcheId: 'h-cxx-courdemanges-1988-oct01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06T23:00:00.000Z'
      }
    ]
  }
]

export {
  titreDemarches,
  titreDemarchesDateDebut,
  titreDemarchesSansOctroi,
  titreDemarchesSansDateDebut
}
