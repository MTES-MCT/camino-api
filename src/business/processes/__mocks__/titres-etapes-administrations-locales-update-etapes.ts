import Administrations from '../../../database/models/administrations'
import Titres from '../../../database/models/titres'

const administrations = [
  { id: 'gestionnaire', domaines: [{ id: 'm' }], titresTypes: [] },
  { id: 'deal-01', departementId: '01', titresTypes: [] },
  { id: 'deal-02', regionId: '02', titresTypes: [] },
  {
    id: 'dea-guyane-01',
    departementId: '973',
    titresTypes: [{ id: 'arm', associee: true }]
  },
  { id: 'ope-onf-973-01', departementId: '973', titresTypes: [] },
  { id: 'xxxx', departementId: 'xxxx', titresTypes: [] }
] as Administrations[]

const titresEtapesCommunes = [
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
] as Titres[]

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
] as unknown) as Titres[]

const titresEtapesCommunesMemeCommune = [
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
] as Titres[]

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
            administrations: [{ id: 'xxx', associee: null }]
          }
        ]
      }
    ]
  }
] as unknown) as Titres[]

const titresEtapesAdministrationLocalesExistante = [
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
            administrations: [{ id: 'deal-01', associee: null }]
          }
        ]
      }
    ]
  }
] as Titres[]

const titresArm = [
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
            communes: [{ departementId: '973' }]
          }
        ]
      }
    ]
  }
] as Titres[]

const titresAxm = [
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
            communes: [{ departementId: '973' }]
          }
        ]
      }
    ]
  }
] as Titres[]

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
