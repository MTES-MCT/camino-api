const administrations = [
  {
    id: 1,
    departementId: 1
  },
  {
    id: 2,
    departementId: 2
  }
]

const titresEtapesCommunes = [
  {
    id: 'h-cxx-courdemanges-1988-oct01-dpu01',
    titreDemarcheId: 'h-cxx-courdemanges-1988-oct01',
    typeId: 'dpu',
    statutId: 'acc',
    ordre: 2,
    date: '1988-03-11T23:00:00.000Z',
    communes: [{ departementId: 1 }, { departementId: 2 }]
  }
]

const titresEtapesCommunesVides = [
  {
    id: 'h-cxx-courdemanges-1988-oct01-dpu01',
    titreDemarcheId: 'h-cxx-courdemanges-1988-oct01',
    typeId: 'dpu',
    statutId: 'acc',
    ordre: 2,
    date: '1988-03-11T23:00:00.000Z',
    communes: []
  }
]

const titresEtapesCommunesMemeCommune = [
  {
    id: 'h-cxx-courdemanges-1988-oct01-dpu01',
    titreDemarcheId: 'h-cxx-courdemanges-1988-oct01',
    typeId: 'dpu',
    statutId: 'acc',
    ordre: 2,
    date: '1988-03-11T23:00:00.000Z',
    communes: [{ departementId: 1 }, { departementId: 1 }]
  }
]

export {
  administrations,
  titresEtapesCommunes,
  titresEtapesCommunesVides,
  titresEtapesCommunesMemeCommune
}
