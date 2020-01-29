import titreEtapeDateCheck from './titre-etape-date-check'

jest.mock('../definitions/titre-etapes-types-restrictions', () => ({
  default: [
    null,
    {},
    { condition: null },
    { condition: {} },
    {
      condition: { etape: { typeId: 'etape-premiere' } },
      obligatoireApresUne: null,
      impossibleApresUne: '*'
    },
    {
      condition: { etape: { typeId: 'etape-milieu-obligatoire-apres' } },
      obligatoireApresUne: { typeId: 'etape-premiere' },
      impossibleApresUne: null
    },
    {
      condition: {
        etape: { typeId: 'etape-milieu-obligatoire-apres-cond-simple' }
      },
      obligatoireApresUne: { typeId: 'etape-premiere', statutId: 'ko' },
      impossibleApresUne: null
    },
    {
      condition: {
        etape: { typeId: 'etape-milieu-obligatoire-apres-cond-tableau' }
      },
      obligatoireApresUne: { typeId: 'etape-premiere', statutId: ['ok', 'ko'] },
      impossibleApresUne: null
    },
    {
      condition: { etape: { typeId: 'etape-milieu-impossible-apres' } },
      obligatoireApresUne: null,
      impossibleApresUne: { typeId: 'etape-derniere' }
    },
    {
      condition: { etape: { typeId: 'etape-derniere' } },
      obligatoireApresUne: null,
      impossibleApresUne: null
    },
    {
      condition: {
        etape: { typeId: 'etape-mecanisee' },
        titre: { contenu: { onf: { mecanisee: true } } }
      },
      obligatoireApresUne: null,
      impossibleApresUne: { propArray: [1, 2] }
    }
  ]
}))

const type = {
  etapesTypes: [
    {
      id: 'etape-premiere',
      nom: 'etape-premiere'
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
      id: 'etape-mecanisee',
      nom: 'etape-mecanisee'
    }
  ]
}

describe("vérifie la date d'une étape pour une démarche en fonction des autres étapes d'une démarche", () => {
  test("un titre de type autre que ARM n'est pas validé", () => {
    expect(titreEtapeDateCheck({}, {}, { typeId: 'autre' })).toBeNull()
  })

  test("une étape historique dont la date est antérieure au 31 octobre 2019 n'est pas validée", () => {
    expect(
      titreEtapeDateCheck(
        { date: '2000-01-01' },
        {},
        { typeId: 'arm', demarches: [{ etapes: [] }] }
      )
    ).toBeNull()
  })

  test('parametre invalide', () => {
    expect(
      titreEtapeDateCheck(
        {},
        { etapes: [{}, null] },
        { typeId: 'arm', demarches: [{ etapes: [] }] }
      )
    ).toBeNull()
  })

  test('aucune restriction', () => {
    expect(
      titreEtapeDateCheck(
        { typeId: 'etape-aucune-restriction' },
        { etapes: [{}, null] },
        { typeId: 'arm', demarches: [{ etapes: [] }] }
      )
    ).toBeNull()
  })

  test('avant la premiere', () => {
    expect(
      titreEtapeDateCheck(
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
        { typeId: 'arm', demarches: [{ etapes: [] }] }
      )
    ).toEqual(
      "Une étape « etape-premiere » antérieure est nécessaire pour la création d'une étape « etape-milieu-obligatoire-apres »."
    )
  })

  test('avant la premiere avec condition simple', () => {
    expect(
      titreEtapeDateCheck(
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
        { typeId: 'arm', demarches: [{ etapes: [] }] }
      )
    ).toEqual(
      "Une étape « etape-premiere » antérieure (dont le statut est « ko ») est nécessaire pour la création d'une étape « etape-milieu-obligatoire-apres-cond-simple »."
    )
  })

  test('avant la premiere avec condition tableau', () => {
    expect(
      titreEtapeDateCheck(
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
        { typeId: 'arm', demarches: [{ etapes: [] }] }
      )
    ).toEqual(
      "Une étape « etape-premiere » antérieure (dont le statut est « ok ou ko ») est nécessaire pour la création d'une étape « etape-milieu-obligatoire-apres-cond-tableau »."
    )
  })

  test('après la premiere', () => {
    expect(
      titreEtapeDateCheck(
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
        { typeId: 'arm', demarches: [{ etapes: [] }] }
      )
    ).toBeNull()
  })

  test('après la dernière', () => {
    expect(
      titreEtapeDateCheck(
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
        { typeId: 'arm', demarches: [{ etapes: [] }] }
      )
    ).toEqual(
      'Une étape « etape-milieu-impossible-apres » ne peut être créée après une étape « etape-derniere ».'
    )
  })

  test('avant la dernière', () => {
    expect(
      titreEtapeDateCheck(
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
        { typeId: 'arm', demarches: [{ etapes: [] }] }
      )
    ).toBeNull()
  })

  test('dernière avant une autre', () => {
    expect(
      titreEtapeDateCheck(
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
        { typeId: 'arm', demarches: [{ etapes: [] }] }
      )
    ).toEqual(
      'Une étape « etape-derniere » ne peut être créée avant une étape « etape-milieu-impossible-apres ».'
    )
  })

  test('dernière après une autre', () => {
    expect(
      titreEtapeDateCheck(
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
        { typeId: 'arm', demarches: [{ etapes: [] }] }
      )
    ).toBeNull()
  })

  test('première après une autre étape', () => {
    expect(
      titreEtapeDateCheck(
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
        { typeId: 'arm', demarches: [{ etapes: [] }] }
      )
    ).toEqual(
      'Une étape « etape-premiere » ne peut être créée après aucune autre étape.'
    )
  })

  test('premiere avant une autre étape', () => {
    expect(
      titreEtapeDateCheck(
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
        { typeId: 'arm', demarches: [{ etapes: [] }] }
      )
    ).toBeNull()
  })

  test('mecanisee', () => {
    expect(
      titreEtapeDateCheck(
        {
          typeId: 'etape-mecanisee',
          date: '2020-01-01'
        },
        {
          type,
          etapes: [{ contenu: { onf: { mecanisee: true } } }]
        },
        {
          typeId: 'arm',
          demarches: [
            {
              type,
              etapes: [{ contenu: { onf: { mecanisee: true } } }]
            }
          ]
        }
      )
    ).toBeNull()
  })
})
