const titreDemarcheOctEtapeMen = [
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
        typeId: 'men',
        statutId: 'dep',
        ordre: 1,
        date: '1988-03-11'
      }
    ]
  }
]

const titreDemarcheOctSansEtapes = [
  {
    id: 'h-cxx-courdemanges-1988-oct01',
    titreId: 'h-cxx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    ordre: 1,
    etapes: []
  }
]

const titreDemarcheOctSansEtapeMen = [
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
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-11'
      }
    ]
  }
]

export {
  titreDemarcheOctEtapeMen,
  titreDemarcheOctSansEtapes,
  titreDemarcheOctSansEtapeMen
}
