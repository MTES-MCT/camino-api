const titresEtapesPoints = [
  {
    id: 'h-cxx-courdemanges-1988-oct01-dpu01',
    titreDemarcheId: 'h-cxx-courdemanges-1988-oct01',
    typeId: 'dpu',
    statutId: 'acc',
    ordre: 2,
    date: '1988-03-11T23:00:00.000Z',
    points: [1, 2]
  }
]

const titresEtapesPointsMemeCommune = [
  {
    id: 'h-cxx-courdemanges-1988-oct01-dpu01',
    titreDemarcheId: 'h-cxx-courdemanges-1988-oct01',
    typeId: 'dpu',
    statutId: 'acc',
    ordre: 2,
    date: '1988-03-11T23:00:00.000Z',
    points: [1, 2]
  }
]

const titresEtapesPointsVides = [
  {
    id: 'h-cxx-courdemanges-1988-oct01-dpu01',
    titreDemarcheId: 'h-cxx-courdemanges-1988-oct01',
    typeId: 'dpu',
    statutId: 'acc',
    ordre: 2,
    date: '1988-03-11T23:00:00.000Z',
    points: []
  }
]

const titresEtapesPointsCommuneInexistante = [
  {
    id: 'h-cxx-courdemanges-1988-oct01-dpu01',
    titreDemarcheId: 'h-cxx-courdemanges-1988-oct01',
    typeId: 'dpu',
    statutId: 'acc',
    ordre: 2,
    date: '1988-03-11T23:00:00.000Z',
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
    id: 'h-cxx-courdemanges-1988-oct01-dpu01',
    titreDemarcheId: 'h-cxx-courdemanges-1988-oct01',
    typeId: 'dpu',
    statutId: 'acc',
    ordre: 2,
    date: '1988-03-11T23:00:00.000Z',
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
