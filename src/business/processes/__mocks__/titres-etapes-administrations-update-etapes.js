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

const titresEtapesCommunes = [
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

const titresEtapesCommunesVides = [
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

const titresEtapesCommunesMemeCommune = [
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

const titresEtapesAdministrationInexistante = [
  {
    id: 'titre-id',
    domaineId: 'h',
    demarches: [
      {
        etapes: [
          {
            id: 'h-cxx-courdemanges-1988-oct01-dpu01',
            typeId: 'dpu',
            communes: [],
            administrations: [
              {
                id: 1
              }
            ]
          }
        ]
      }
    ]
  }
]

const titresEtapesAdministrationExistante = [
  {
    id: 'titre-id',
    domaineId: 'h',
    demarches: [
      {
        etapes: [
          {
            id: 'h-cxx-courdemanges-1988-oct01-dpu01',
            typeId: 'dpu',
            communes: [{ departementId: 1, departement: { regionId: 1 } }],
            administrations: [
              {
                id: 1
              }
            ]
          }
        ]
      }
    ]
  }
]

const titresArm = [
  {
    id: 'titre-id',
    typeId: 'arm',
    demarches: [
      {
        etapes: [
          {
            id: 'm-arm-crique-saint-doux-oct01-men01',
            titreDemarcheId: 'm-arm-crique-saint-doux-oct01',
            typeId: 'men',
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

const titresAxm = [
  {
    id: 'titre-id',
    typeId: 'axm',
    demarches: [
      {
        etapes: [
          {
            id: 'm-axm-crique-saint-doux-oct01-men01',
            titreDemarcheId: 'm-axm-crique-saint-doux-oct01',
            typeId: 'men',
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

export {
  administrations,
  titresEtapesCommunes,
  titresEtapesCommunesVides,
  titresEtapesCommunesMemeCommune,
  titresEtapesAdministrationInexistante,
  titresEtapesAdministrationExistante,
  titresArm,
  titresAxm
}
