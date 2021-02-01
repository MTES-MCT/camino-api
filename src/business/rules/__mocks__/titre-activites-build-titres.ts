import { IActiviteType } from '../../../types'

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
          frequencePeriodesIds: [3]
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
    frequencePeriodeId: 1,
    annee: 2018,
    sections: [
      {
        id: 'substancesFiscales',
        elements: [
          {
            id: 'auru',
            nom: 'Or',
            type: 'number',
            description: 'métal précieux (<b>kilogramme</b>)'
          },
          {
            id: 'sela',
            nom: 'Sel',
            type: 'number',
            description: 'Sel (<b>tonnes</b>)',
            referenceUniteRatio: 0.001
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
    frequencePeriodeId: 1,
    annee: 2018,
    sections: [
      {
        id: 'renseignements',
        elements: [
          {
            id: 'champ-1',
            nom: 'Nom champ 1',
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
    frequencePeriodeId: 2,
    annee: 2018,
    sections: [
      {
        id: 'renseignements',
        elements: [
          {
            id: 'champ-1',
            nom: 'Nom champ 1',
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
    frequencePeriodeId: 3,
    annee: 2018,
    sections: [
      {
        id: 'renseignements',
        elements: [
          {
            id: 'champ-1',
            nom: 'Nom champ 1',
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
    frequencePeriodeId: 4,
    annee: 2018,
    sections: [
      {
        id: 'renseignements',
        elements: [
          {
            id: 'champ-1',
            nom: 'Nom champ 1',
            type: 'number',
            description: 'Description champs 1'
          }
        ],
        nom: 'Renseignements'
      }
    ]
  }
]

export {
  titreActivitesGra,
  titreActivitesGrp,
  activiteTypeGra,
  activiteTypeGrp
}
