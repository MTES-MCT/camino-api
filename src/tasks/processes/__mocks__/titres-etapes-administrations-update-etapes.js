const administrations = [
  {
    id: 1,
    departementId: 1,
    domaines: [{ id: 'h' }]
  },
  {
    id: 2,
    regionId: 2,
    domaines: []
  },
  {
    id: 3
  }
]

const titresCommunes = [
  {
    id: 'titre-id',
    domaineId: 'h',
    demarches: [
      {
        etapes: [
          {
            id: 'h-cxx-courdemanges-1988-oct01-dpu01',
            typeId: 'dpu',
            communes: [
              { id: 'paris', departementId: 1, departement: { regionId: 1 } },
              { id: 'issy', departementId: 1, departement: { regionId: 1 } },
              { id: 'ivry', departementId: 2, departement: { regionId: 2 } },
              { id: 'evry', departementId: 2, departement: { regionId: 2 } }
            ]
          },
          {
            typeId: 'chh',
            communes: [{}]
          }
        ]
      }
    ]
  }
]

const titresCommunesVides = [
  {
    id: 'titre-id',
    demarches: [
      {
        etapes: [
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
      }
    ]
  }
]

const titresCommunesMemeCommune = [
  {
    id: 'titre-id',
    demarches: [
      {
        etapes: [
          {
            id: 'h-cxx-courdemanges-1988-oct01-dpu01',
            titreDemarcheId: 'h-cxx-courdemanges-1988-oct01',
            typeId: 'dpu',
            statutId: 'acc',
            ordre: 2,
            date: '1988-03-11T23:00:00.000Z',
            communes: [
              { departementId: 1, departement: { regionId: 1 } },
              { departementId: 1, departement: { regionId: 1 } }
            ]
          }
        ]
      }
    ]
  }
]

export {
  administrations,
  titresCommunes,
  titresCommunesVides,
  titresCommunesMemeCommune
}
