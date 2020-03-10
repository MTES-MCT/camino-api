import { IAdministration, ITitre } from '../../../types'

const administrations = [
  {
    id: 'gestionnaire',
    domaines: [{ id: 'm' }]
  },
  {
    id: 'deal-01',
    departementId: '01'
  },
  {
    id: 'deal-02',
    regionId: '02'
  },
  {
    id: 'dea-guyane-01',
    departementId: '973'
  },
  {
    id: 'ope-onf-973-01',
    departementId: '973'
  },
  {
    id: 'xxxx',
    departementId: 'xxxx'
  }
] as IAdministration[]

const titresEtapesCommunes = ([
  {
    id: 'titre-id',
    domaineId: 'h',
    demarches: [
      {
        etapes: [
          {
            id: 'h-cx-courdemanges-1988-oct01-dpu01',
            typeId: 'dpu',
            communes: [
              {
                id: 'paris',
                departementId: '01',
                departement: { regionId: '01' }
              },
              {
                id: 'issy',
                departementId: '01',
                departement: { regionId: '01' }
              },
              {
                id: 'ivry',
                departementId: '02',
                departement: { regionId: '02' }
              },
              {
                id: 'evry',
                departementId: '02',
                departement: { regionId: '02' }
              }
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
] as unknown) as ITitre[]

const titresEtapesCommunesVides = ([
  {
    id: 'titre-id',
    demarches: [
      {
        etapes: [
          {
            id: 'h-cx-courdemanges-1988-oct01-dpu01',
            titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
            typeId: 'dpu',
            statutId: 'acc',
            ordre: 2,
            date: '1988-03-11',
            communes: []
          }
        ]
      }
    ]
  }
] as unknown) as ITitre[]

const titresEtapesCommunesMemeCommune = ([
  {
    id: 'titre-id',
    demarches: [
      {
        etapes: [
          {
            id: 'h-cx-courdemanges-1988-oct01-dpu01',
            titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
            typeId: 'dpu',
            statutId: 'acc',
            ordre: 2,
            date: '1988-03-11',
            communes: [
              { departementId: '01', departement: { regionId: '01' } },
              { departementId: '01', departement: { regionId: '01' } }
            ]
          }
        ]
      }
    ]
  }
] as unknown) as ITitre[]

const titresEtapesAdministrationLocalesInexistante = ([
  {
    id: 'titre-id',
    domaineId: 'h',
    demarches: [
      {
        etapes: [
          {
            id: 'h-cx-courdemanges-1988-oct01-dpu01',
            typeId: 'dpu',
            communes: [],
            administrations: [
              {
                id: 'xxx'
              }
            ]
          }
        ]
      }
    ]
  }
] as unknown) as ITitre[]

const titresEtapesAdministrationLocalesExistante = ([
  {
    id: 'titre-id',
    domaineId: 'h',
    demarches: [
      {
        etapes: [
          {
            id: 'h-cx-courdemanges-1988-oct01-dpu01',
            typeId: 'dpu',
            communes: [
              { departementId: '01', departement: { regionId: '01' } }
            ],
            administrations: [
              {
                id: 'deal-01'
              }
            ]
          }
        ]
      }
    ]
  }
] as unknown) as ITitre[]

const titresArm = ([
  {
    id: 'titre-id',
    typeId: 'arm',
    domaineId: 'm',
    demarches: [
      {
        etapes: [
          {
            id: 'm-arm-crique-saint-doux-oct01-men01',
            titreDemarcheId: 'm-arm-crique-saint-doux-oct01',
            typeId: 'men',
            statutId: 'acc',
            ordre: 2,
            date: '1988-03-11',
            communes: [
              {
                departementId: '973'
              }
            ]
          }
        ]
      }
    ]
  }
] as unknown) as ITitre[]

const titresAxm = ([
  {
    id: 'titre-id',
    typeId: 'axm',
    domaineId: 'm',
    demarches: [
      {
        etapes: [
          {
            id: 'm-ax-crique-saint-doux-oct01-men01',
            titreDemarcheId: 'm-ax-crique-saint-doux-oct01',
            typeId: 'men',
            statutId: 'acc',
            ordre: 2,
            date: '1988-03-11',
            communes: [
              {
                departementId: '973'
              }
            ]
          }
        ]
      }
    ]
  }
] as unknown) as ITitre[]

export {
  administrations,
  titresEtapesCommunes,
  titresEtapesCommunesVides,
  titresEtapesCommunesMemeCommune,
  titresEtapesAdministrationLocalesInexistante,
  titresEtapesAdministrationLocalesExistante,
  titresArm,
  titresAxm
}
