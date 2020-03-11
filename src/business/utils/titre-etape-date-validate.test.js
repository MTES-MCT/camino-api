import titreEtapeDateValidate from './titre-etape-date-validate'

jest.mock('../definitions/titres-types-etapes-types-restrictions', () => ({
  default: {
    arm: [
      null,
      {},
      { condition: null },
      { condition: {} },
      {
        condition: { etape: { typeId: 'etape-impossible' } },
        impossible: true
      },
      {
        condition: {
          etape: { typeId: 'etape-impossible-statut', statutId: 'acc' }
        },
        impossible: true
      },
      {
        condition: { etape: { typeId: 'etape-premiere' } },
        obligatoireApres: null,
        impossibleApres: ['*']
      },
      {
        condition: { etape: { typeId: 'etape-milieu-obligatoire-apres' } },
        obligatoireApres: [{ typeId: 'etape-premiere' }],
        impossibleApres: null
      },
      {
        obligatoireApres: [
          {
            typeId: 'etape-premiere',
            statutId: ['ok', 'ko']
          }
        ],
        impossibleApres: null
      },
      {
        condition: { etape: { typeId: 'etape-milieu-impossible-apres' } },
        obligatoireApres: null,
        impossibleApres: [{ typeId: 'etape-derniere' }]
      },
      {
        condition: { etape: { typeId: 'etape-derniere' } },
        obligatoireApres: null,
        impossibleApres: null
      },
      {
        condition: {
          etape: { typeId: 'etape-mecanise' },
          titre: { contenu: { arm: { mecanise: true } } }
        },
        obligatoireApres: [{ typeId: 'etape-premiere' }]
      },
      {
        condition: {
          etape: { typeId: 'etape-milieu-obligatoire-apres-cond-simple' }
        },
        obligatoireApres: [{ typeId: 'etape-premiere', statutId: 'ko' }],
        impossibleApres: null
      },
      {
        condition: {
          etape: { typeId: 'etape-milieu-obligatoire-apres-cond-tableau' }
        },
        obligatoireApres: [
          {
            typeId: 'etape-premiere',
            statutId: ['ok', 'ko']
          }
        ],
        impossibleApres: null
      },
      {
        condition: { etape: { typeId: 'etape-derniere' } },
        obligatoireApres: null,
        impossibleApres: null
      },
      {
        condition: {
          etape: { typeId: 'etape-mecanisee' },
          titre: { contenu: { arm: { mecanise: true } } }
        },
        obligatoireApres: null,
        impossibleApres: [{ propArray: [1, 2] }]
      }
    ]
  }
}))

const type = {
  etapesTypes: [
    {
      id: 'etape-premiere',
      nom: 'etape-premiere'
    },
    {
      id: 'etape-impossible',
      nom: 'etape-impossible'
    },
    {
      id: 'etape-impossible-statut',
      nom: 'etape-impossible-statut'
    },
    {
      id: 'etape-milieu-obligatoire-apres',
      nom: 'etape-milieu-obligatoire-apres'
    },
    {
      id: 'etape-milieu-obligatoire-apres-cond-simple',
      nom: 'etape-milieu-obligatoire-apres-cond-simple'
    },
    {
      id: 'etape-milieu-obligatoire-apres-cond-tableau',
      nom: 'etape-milieu-obligatoire-apres-cond-tableau'
    },
    {
      id: 'etape-milieu-impossible-apres',
      nom: 'etape-milieu-impossible-apres'
    },
    {
      id: 'etape-derniere',
      nom: 'etape-derniere'
    },
    {
      id: 'etape-mecanise',
      nom: 'etape-mecanise'
    }
  ]
}

describe("vérifie la date d'une étape pour une démarche en fonction des autres étapes d'une démarche", () => {
  test("un titre de type autre que ARM n'est pas validé", () => {
    expect(titreEtapeDateValidate({}, {}, { typeId: 'autre' })).toBeNull()
  })

  test("une étape historique dont la date est antérieure au 31 octobre 2019 n'est pas validée", () => {
    expect(
      titreEtapeDateValidate({ date: '2000-01-01' }, {}, { typeId: 'arm' })
    ).toBeNull()
  })

  test('parametre invalide', () => {
    expect(
      titreEtapeDateValidate({}, { etapes: [{}, null] }, { typeId: 'arm' })
    ).toBeNull()
  })

  test('aucune restriction', () => {
    expect(
      titreEtapeDateValidate(
        { typeId: 'etape-aucune-restriction' },
        { etapes: [{}, null] },
        { typeId: 'arm' }
      )
    ).toBeNull()
  })

  test('impossible', () => {
    expect(
      titreEtapeDateValidate(
        {
          typeId: 'etape-impossible',
          date: '3000-01-01'
        },
        {
          type,
          etapes: []
        },
        { typeId: 'arm' }
      )
    ).toEqual("L'étape « etape-impossible » est impossible.")
  })

  test('impossible avec statut', () => {
    expect(
      titreEtapeDateValidate(
        {
          typeId: 'etape-impossible-statut',
          statutId: 'acc',
          date: '3000-01-01'
        },
        {
          type,
          etapes: []
        },
        { typeId: 'arm' }
      )
    ).toEqual(
      "L'étape « etape-impossible-statut » avec un statut « acc » est impossible."
    )
  })

  test('avant la premiere', () => {
    expect(
      titreEtapeDateValidate(
        {
          typeId: 'etape-milieu-obligatoire-apres',
          date: '3000-01-01'
        },
        {
          type,
          etapes: [
            {
              typeId: 'etape-premiere',
              date: '4000-01-01'
            }
          ]
        },
        { typeId: 'arm' }
      )
    ).toEqual(
      "Une étape « etape-premiere » antérieure est nécessaire pour la création d'une étape « etape-milieu-obligatoire-apres »."
    )
  })

  test('avant la premiere avec condition simple', () => {
    expect(
      titreEtapeDateValidate(
        {
          typeId: 'etape-milieu-obligatoire-apres-cond-simple',
          date: '3000-01-01'
        },
        {
          type,
          etapes: [
            {
              typeId: 'etape-premiere',
              date: '4000-01-01',
              statutId: 'ko'
            }
          ]
        },
        { typeId: 'arm' }
      )
    ).toEqual(
      "Une étape « etape-premiere » antérieure (dont le statut est « ko ») est nécessaire pour la création d'une étape « etape-milieu-obligatoire-apres-cond-simple »."
    )
  })

  test('avant la premiere avec condition tableau', () => {
    expect(
      titreEtapeDateValidate(
        {
          typeId: 'etape-milieu-obligatoire-apres-cond-tableau',
          date: '3000-01-01'
        },
        {
          type,
          etapes: [
            {
              typeId: 'etape-premiere',
              date: '4000-01-01',
              statutId: 'ok'
            }
          ]
        },
        { typeId: 'arm' }
      )
    ).toEqual(
      "Une étape « etape-premiere » antérieure (dont le statut est « ok ou ko ») est nécessaire pour la création d'une étape « etape-milieu-obligatoire-apres-cond-tableau »."
    )
  })

  test('après la premiere', () => {
    expect(
      titreEtapeDateValidate(
        {
          typeId: 'etape-milieu-obligatoire-apres',
          date: '5000-01-01'
        },
        {
          type,
          etapes: [
            {
              typeId: 'etape-premiere',
              date: '4000-01-01',
              statutId: 'ok'
            }
          ]
        },
        { typeId: 'arm' }
      )
    ).toBeNull()
  })

  test('après la dernière', () => {
    expect(
      titreEtapeDateValidate(
        {
          typeId: 'etape-milieu-impossible-apres',
          date: '5000-01-01'
        },
        {
          type,
          etapes: [
            {
              typeId: 'etape-derniere',
              date: '4000-01-01'
            }
          ]
        },
        { typeId: 'arm' }
      )
    ).toEqual(
      'Une étape « etape-milieu-impossible-apres » ne peut être créée après une étape « etape-derniere ».'
    )
  })

  test('avant la dernière', () => {
    expect(
      titreEtapeDateValidate(
        {
          typeId: 'etape-milieu-impossible-apres',
          date: '3000-01-01'
        },
        {
          type,
          etapes: [
            {
              typeId: 'etape-derniere',
              date: '4000-01-01'
            }
          ]
        },
        { typeId: 'arm' }
      )
    ).toBeNull()
  })

  test('dernière avant une autre', () => {
    expect(
      titreEtapeDateValidate(
        {
          typeId: 'etape-derniere',
          date: '3000-01-01'
        },
        {
          type,
          etapes: [
            {
              typeId: 'etape-milieu-impossible-apres',
              date: '4000-01-01'
            }
          ]
        },
        { typeId: 'arm' }
      )
    ).toEqual(
      'Une étape « etape-derniere » ne peut être créée avant une étape « etape-milieu-impossible-apres ».'
    )
  })

  test('dernière après une autre', () => {
    expect(
      titreEtapeDateValidate(
        {
          typeId: 'etape-derniere',
          date: '5000-01-01'
        },
        {
          type,
          etapes: [
            {
              typeId: 'etape-milieu-impossible-apres',
              date: '4000-01-01'
            }
          ]
        },
        { typeId: 'arm' }
      )
    ).toBeNull()
  })

  test('première après une autre étape', () => {
    expect(
      titreEtapeDateValidate(
        {
          typeId: 'etape-premiere',
          date: '5000-01-01'
        },
        {
          type,
          etapes: [
            {
              typeId: 'etape',
              date: '4000-01-01'
            }
          ]
        },
        { typeId: 'arm' }
      )
    ).toEqual(
      'Une étape « etape-premiere » ne peut être créée après aucune autre étape.'
    )
  })

  test('premiere avant une autre étape', () => {
    expect(
      titreEtapeDateValidate(
        {
          typeId: 'etape-premiere',
          date: '3000-01-01'
        },
        {
          type,
          etapes: [
            {
              typeId: 'etape',
              date: '4000-01-01'
            }
          ]
        },
        { typeId: 'arm' }
      )
    ).toBeNull()
  })

  test('etape mecanise sur titre mecanise sans etape obligatoire', () => {
    expect(
      titreEtapeDateValidate(
        {
          typeId: 'etape-mecanise',
          date: '2020-01-01'
        },
        {
          type,
          etapes: [{}]
        },
        {
          typeId: 'arm',
          contenu: { arm: { mecanise: true } }
        }
      )
    ).toEqual(
      "Une étape « etape-premiere » antérieure est nécessaire pour la création d'une étape « etape-mecanise »."
    )
  })

  test('etape mecanise sur titre mecanise avec etape obligatoire', () => {
    expect(
      titreEtapeDateValidate(
        {
          typeId: 'etape-mecanise',
          date: '2020-01-01'
        },
        {
          type,
          etapes: [{ typeId: 'etape-premiere', date: '2000-01-01' }]
        },
        {
          typeId: 'arm',
          contenu: { arm: { mecanise: true } }
        }
      )
    ).toBeNull()
  })
})
