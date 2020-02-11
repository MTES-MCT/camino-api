const titresEtapesPoints = [
  {
    id: 'h-cx-courdemanges-1988-oct01-dpu01',
    titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
    typeId: 'dpu',
    statutId: 'acc',
    ordre: 2,
    date: '1988-03-11',
    points: [1, 2]
  }
]

const titresEtapesPointsMemeCommune = [
  {
    id: 'h-cx-courdemanges-1988-oct01-dpu01',
    titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
    typeId: 'dpu',
    statutId: 'acc',
    ordre: 2,
    date: '1988-03-11',
    points: [1, 2]
  }
]

const titresEtapesPointsVides = [
  {
    id: 'h-cx-courdemanges-1988-oct01-dpu01',
    titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
    typeId: 'dpu',
    statutId: 'acc',
    ordre: 2,
    date: '1988-03-11',
    points: []
  }
]

const titresEtapesPointsCommuneInexistante = [
  {
    id: 'h-cx-courdemanges-1988-oct01-dpu01',
    titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
    typeId: 'dpu',
    statutId: 'acc',
    ordre: 2,
    date: '1988-03-11',
    points: [],
    communes: [
      {
        id: 1
      }
    ]
  }
]

const titresEtapesPointsCommuneExistante = [
  {
    id: 'h-cx-courdemanges-1988-oct01-dpu01',
    titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
    typeId: 'dpu',
    statutId: 'acc',
    ordre: 2,
    date: '1988-03-11',
    points: [1, 2],
    communes: [
      {
        id: 1
      }
    ]
  }
]

export {
  titresEtapesPoints,
  titresEtapesPointsMemeCommune,
  titresEtapesPointsVides,
  titresEtapesPointsCommuneInexistante,
  titresEtapesPointsCommuneExistante
}
