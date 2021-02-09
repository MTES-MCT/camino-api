import { IActiviteType, ITitreDemarche } from '../../../types'

const activiteTypeGra = ({
  id: 'gra',
  frequence: { periodesNom: 'annees', annees: [1] },
  sections: [{ id: 'substancesFiscales' }]
} as unknown) as IActiviteType

const activiteTypeGrp = ({
  id: 'grp',
  frequence: { periodesNom: 'trimestres', trimestres: [...new Array(4)] },
  sections: [
    {
      id: 'renseignements',
      nom: 'Renseignements',
      elements: [
        {
          id: 'champ-1',
          nom: 'Nom champ 1',
          type: 'number',
          optionnel: true,
          description: 'Description champs 1'
        },
        {
          id: 'champ-2',
          nom: 'Nom champs 2',
          type: 'checkboxes',
          valeurs: [{ id: 'un', nom: 'Uno' }],
          dateFin: '2018-04-01',
          description: 'Description champs 2'
        },
        {
          id: 'champ-3',
          nom: 'Nom champs 3',
          type: 'checkboxes',
          valeursMetasNom: 'unites',
          dateDebut: '2018-07-01',
          description: 'Description champs 3',
          periodesIds: [3]
        }
      ]
    }
  ]
} as unknown) as IActiviteType

const titreActivitesGra = [
  {
    titreId: 'titre-id',
    date: '2019-01-01',
    typeId: 'gra',
    statutId: 'abs',
    periodeId: 1,
    annee: 2018,
    sections: [
      {
        id: 'substancesFiscales',
        elements: [
          {
            id: 'auru',
            nom: 'Or',
            type: 'number',
            description: '<b>kg (kilogramme)</b> métal précieux',
            uniteId: 'mkg'
          },
          {
            id: 'sela',
            nom: 'Sel',
            type: 'number',
            description: '<b>t (tonne)</b> Sel',
            referenceUniteRatio: 0.001,
            uniteId: 'mtn'
          }
        ]
      }
    ]
  }
]

const titreActivitesGrp = [
  {
    titreId: 'titre-id',
    date: '2018-04-01',
    typeId: 'grp',
    statutId: 'abs',
    periodeId: 1,
    annee: 2018,
    sections: [
      {
        id: 'renseignements',
        elements: [
          {
            id: 'champ-1',
            nom: 'Nom champ 1',
            optionnel: true,
            type: 'number',
            description: 'Description champs 1'
          },
          {
            id: 'champ-2',
            nom: 'Nom champs 2',
            type: 'checkboxes',
            description: 'Description champs 2',
            valeurs: [{ id: 'un', nom: 'Uno' }]
          }
        ],
        nom: 'Renseignements'
      }
    ]
  },
  {
    titreId: 'titre-id',
    date: '2018-07-01',
    typeId: 'grp',
    statutId: 'abs',
    periodeId: 2,
    annee: 2018,
    sections: [
      {
        id: 'renseignements',
        elements: [
          {
            id: 'champ-1',
            nom: 'Nom champ 1',
            optionnel: true,
            type: 'number',
            description: 'Description champs 1'
          }
        ],
        nom: 'Renseignements'
      }
    ]
  },
  {
    titreId: 'titre-id',
    date: '2018-10-01',
    typeId: 'grp',
    statutId: 'abs',
    periodeId: 3,
    annee: 2018,
    sections: [
      {
        id: 'renseignements',
        elements: [
          {
            id: 'champ-1',
            nom: 'Nom champ 1',
            optionnel: true,
            type: 'number',
            description: 'Description champs 1'
          },
          {
            id: 'champ-3',
            nom: 'Nom champs 3',
            type: 'checkboxes',
            description: 'Description champs 3',
            valeurs: [
              { id: 'mkg', nom: 'kilogramme' },
              { id: 'lit', nom: 'Litres' }
            ]
          }
        ],
        nom: 'Renseignements'
      }
    ]
  },
  {
    titreId: 'titre-id',
    date: '2019-01-01',
    typeId: 'grp',
    statutId: 'abs',
    periodeId: 4,
    annee: 2018,
    sections: [
      {
        id: 'renseignements',
        elements: [
          {
            id: 'champ-1',
            nom: 'Nom champ 1',
            optionnel: true,
            type: 'number',
            description: 'Description champs 1'
          }
        ],
        nom: 'Renseignements'
      }
    ]
  }
]

const titreDemarches = [
  {
    id: 'demarche-id',
    statutId: 'acc',
    typeId: 'oct',
    phase: { dateDebut: '2018-01-01', dateFin: '2018-12-31' },
    etapes: [
      {
        id: 'etape-id',
        date: '2018-01-01',
        typeId: 'dpu',
        statutId: 'fai',
        substances: [
          {
            id: 'auru',
            legales: [
              {
                fiscales: [
                  {
                    id: 'auru',
                    nom: 'Or',
                    description: 'métal précieux',
                    unite: { nom: 'kilogramme', symbole: 'kg' },
                    uniteId: 'mkg'
                  },
                  {
                    id: 'sela',
                    nom: 'Sel',
                    description: 'Sel',
                    uniteId: 'mtn',
                    unite: {
                      nom: 'tonne',
                      referenceUniteRatio: 0.001,
                      symbole: 't'
                    }
                  },
                  null
                ]
              }
            ]
          }
        ]
      }
    ]
  } as ITitreDemarche
]

export {
  titreActivitesGra,
  titreActivitesGrp,
  activiteTypeGra,
  activiteTypeGrp,
  titreDemarches
}
