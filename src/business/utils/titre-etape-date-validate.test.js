import titreEtapeDateValidate from './titre-etape-date-validate'

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
        etape: { typeId: 'etape-mecanise' },
        titre: { contenu: { arm: { mecanise: true } } }
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
      titreEtapeDateValidate(
        { date: '2000-01-01' },
        {},
        { typeId: 'arm', demarches: [{ etapes: [] }] }
      )
    ).toBeNull()
  })

  test('parametre invalide', () => {
    expect(
      titreEtapeDateValidate(
        {},
        { etapes: [{}, null] },
        { typeId: 'arm', demarches: [{ etapes: [] }] }
      )
    ).toBeNull()
  })

  test('aucune restriction', () => {
    expect(
      titreEtapeDateValidate(
        { typeId: 'etape-aucune-restriction' },
        { etapes: [{}, null] },
        { typeId: 'arm', demarches: [{ etapes: [] }] }
      )
    ).toBeNull()
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
        { typeId: 'arm', demarches: [{ etapes: [] }] }
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
        { typeId: 'arm', demarches: [{ etapes: [] }] }
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
        { typeId: 'arm', demarches: [{ etapes: [] }] }
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
        { typeId: 'arm', demarches: [{ etapes: [] }] }
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
        { typeId: 'arm', demarches: [{ etapes: [] }] }
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
        { typeId: 'arm', demarches: [{ etapes: [] }] }
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
        { typeId: 'arm', demarches: [{ etapes: [] }] }
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
        { typeId: 'arm', demarches: [{ etapes: [] }] }
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
        { typeId: 'arm', demarches: [{ etapes: [] }] }
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
        { typeId: 'arm', demarches: [{ etapes: [] }] }
      )
    ).toBeNull()
  })

  test('mecanise', () => {
    expect(
      titreEtapeDateValidate(
        {
          typeId: 'etape-mecanise',
          date: '2020-01-01'
        },
        {
          type,
          etapes: [{ contenu: { arm: { mecanise: true } } }]
        },
        {
          typeId: 'arm',
          demarches: [
            {
              type,
              etapes: [{ contenu: { arm: { mecanise: true } } }]
            }
          ]
        }
      )
    ).toBeNull()
  })
})
