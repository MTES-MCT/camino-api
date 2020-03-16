import { ITitreEtape, ITitreDemarche, ITitre } from '../../types'

import titreEtapeDateValidate from './titre-etape-date-validate'

jest.mock('../definitions/titres-types-etapes-types-restrictions', () => ({
  default: [
    {
      typeId: 'arm',
      restrictions: [
        {
          condition: { etape: { typeId: 'etape-premiere' } }
        },
        {
          condition: { etape: { typeId: 'etape-premiere', statutId: 'ok' } },
          impossibleAvant: []
        },
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
          condition: {
            etape: {
              typeId:
                'etape-milieu-obligatoire-apres-etape-premiere-et-impossible-apres-etape-derniere'
            }
          },
          obligatoireApres: [{ typeId: 'etape-premiere' }],
          impossibleApres: [{ typeId: 'etape-derniere' }]
        },
        {
          condition: {
            etape: { typeId: 'etape-milieu-impossible-apres-etape-derniere' }
          },
          impossibleApres: [{ typeId: 'etape-derniere' }]
        },
        {
          condition: {
            etape: { typeId: 'etape-milieu-impossible-avant-etape-premiere' }
          },
          impossibleAvant: [{ typeId: 'etape-premiere' }]
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
            etape: {
              typeId:
                'etape-milieu-obligatoire-apres-etape-premiere-cond-simple'
            }
          },
          obligatoireApres: [{ typeId: 'etape-premiere', statutId: 'ko' }],
          impossibleApres: [{ typeId: 'etape-premiere', statutId: 'ok' }]
        },
        {
          condition: {
            etape: { typeId: 'etape-mecanisee' },
            titre: { contenu: { arm: { mecanise: true } } }
          },
          obligatoireApres: [{ typeId: 'etape-premiere' }]
        }
      ]
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
      id: 'etape-impossible',
      nom: 'etape-impossible'
    },
    {
      id: 'etape-impossible-statut',
      nom: 'etape-impossible-statut'
    },
    {
      id:
        'etape-milieu-obligatoire-apres-etape-premiere-et-impossible-apres-etape-derniere',
      nom:
        'etape-milieu-obligatoire-apres-etape-premiere-et-impossible-apres-etape-derniere'
    },
    {
      id: 'etape-milieu-obligatoire-apres-etape-premiere-cond-simple',
      nom: 'etape-milieu-obligatoire-apres-etape-premiere-cond-simple'
    },
    {
      id: 'etape-milieu-impossible-apres-etape-derniere',
      nom: 'etape-milieu-impossible-apres-etape-derniere'
    },
    {
      id: 'etape-milieu-impossible-avant-etape-premiere',
      nom: 'etape-milieu-impossible-avant-etape-premiere'
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
    expect(
      titreEtapeDateValidate(
        ({} as unknown) as ITitreEtape,
        ({} as unknown) as ITitreDemarche,
        ({ typeId: 'autre' } as unknown) as ITitre
      )
    ).toBeNull()
  })

  test("une étape historique dont la date est antérieure au 31 octobre 2019 n'est pas validée", () => {
    expect(
      titreEtapeDateValidate(
        ({ date: '2000-01-01' } as unknown) as ITitreEtape,
        ({} as unknown) as ITitreDemarche,
        ({ typeId: 'arm' } as unknown) as ITitre
      )
    ).toBeNull()
  })

  test('parametre invalide', () => {
    expect(
      titreEtapeDateValidate(
        ({} as unknown) as ITitreEtape,
        ({ etapes: [{}, null] } as unknown) as ITitreDemarche,
        ({ typeId: 'arm' } as unknown) as ITitre
      )
    ).toBeNull()
  })

  test('aucune restriction', () => {
    expect(
      titreEtapeDateValidate(
        ({ typeId: 'etape-aucune-restriction' } as unknown) as ITitreEtape,
        ({ etapes: [{}, null] } as unknown) as ITitreDemarche,
        ({ typeId: 'arm' } as unknown) as ITitre
      )
    ).toBeNull()
  })

  test('impossible = true', () => {
    expect(
      titreEtapeDateValidate(
        ({
          typeId: 'etape-impossible',
          date: '3000-01-01'
        } as unknown) as ITitreEtape,
        ({
          type,
          etapes: []
        } as unknown) as ITitreDemarche,
        ({ typeId: 'arm' } as unknown) as ITitre
      )
    ).toEqual("L'étape « etape-impossible » est impossible.")
  })

  test('impossible = true avec statut', () => {
    expect(
      titreEtapeDateValidate(
        ({
          typeId: 'etape-impossible-statut',
          statutId: 'acc',
          date: '3000-01-01'
        } as unknown) as ITitreEtape,
        ({
          type,
          etapes: []
        } as unknown) as ITitreDemarche,
        ({ typeId: 'arm' } as unknown) as ITitre
      )
    ).toEqual(
      "L'étape « etape-impossible-statut » avec un statut « acc » est impossible."
    )
  })

  test('obligatoireApres, sans étape obligatoire postérieure dans la démarche retourne une erreur', () => {
    expect(
      titreEtapeDateValidate(
        ({
          typeId:
            'etape-milieu-obligatoire-apres-etape-premiere-et-impossible-apres-etape-derniere',
          date: '3000-01-01'
        } as unknown) as ITitreEtape,
        ({
          type,
          etapes: [
            {
              typeId: 'etape-premiere',
              date: '4000-01-01'
            }
          ]
        } as unknown) as ITitreDemarche,
        ({ typeId: 'arm' } as unknown) as ITitre
      )
    ).toEqual(
      "Une étape « etape-premiere » antérieure est nécessaire pour la création d'une étape « etape-milieu-obligatoire-apres-etape-premiere-et-impossible-apres-etape-derniere »."
    )
  })

  test('obligatoireApres, sans étape obligatoire postérieure avec un statut obligatoire dans la démarche retourne une erreur', () => {
    expect(
      titreEtapeDateValidate(
        ({
          typeId: 'etape-milieu-obligatoire-apres-etape-premiere-cond-simple',
          date: '3000-01-01'
        } as unknown) as ITitreEtape,
        ({
          type,
          etapes: [
            {
              typeId: 'etape-premiere',
              date: '4000-01-01',
              statutId: 'ko'
            }
          ]
        } as unknown) as ITitreDemarche,
        ({ typeId: 'arm' } as unknown) as ITitre
      )
    ).toEqual(
      "Une étape « etape-premiere » antérieure (dont le statut est « ko ») est nécessaire pour la création d'une étape « etape-milieu-obligatoire-apres-etape-premiere-cond-simple »."
    )
  })

  test("obligatoireApres, avec étape obligatoire antérieure dans la démarche ne retourne pas d'erreur", () => {
    expect(
      titreEtapeDateValidate(
        ({
          typeId:
            'etape-milieu-obligatoire-apres-etape-premiere-et-impossible-apres-etape-derniere',
          date: '5000-01-01'
        } as unknown) as ITitreEtape,
        ({
          type,
          etapes: [
            {
              typeId: 'etape-premiere',
              date: '4000-01-01',
              statutId: 'ok'
            }
          ]
        } as unknown) as ITitreDemarche,
        ({ typeId: 'arm' } as unknown) as ITitre
      )
    ).toBeNull()
  })

  test("obligatoireApres, avec étape obligatoire antérieur dont le statut obligatoire est correct dans la démarche ne retourne pas d'erreur", () => {
    expect(
      titreEtapeDateValidate(
        ({
          typeId: 'etape-milieu-obligatoire-apres-etape-premiere-cond-simple',
          date: '5000-01-01'
        } as unknown) as ITitreEtape,
        ({
          type,
          etapes: [
            {
              typeId: 'etape-premiere',
              date: '4000-01-01',
              statutId: 'ko'
            }
          ]
        } as unknown) as ITitreDemarche,
        ({ typeId: 'arm' } as unknown) as ITitre
      )
    ).toBeNull()
  })

  test('obligatoireApres, avec étape obligatoire antérieure dont le statut obligatoire est incorrect dans la démarche retourne une erreur', () => {
    expect(
      titreEtapeDateValidate(
        ({
          typeId: 'etape-milieu-obligatoire-apres-etape-premiere-cond-simple',
          date: '5000-01-01'
        } as unknown) as ITitreEtape,
        ({
          type,
          etapes: [
            {
              typeId: 'etape-premiere',
              date: '4000-01-01',
              statutId: 'ok'
            }
          ]
        } as unknown) as ITitreDemarche,
        ({ typeId: 'arm' } as unknown) as ITitre
      )
    ).toEqual(
      "Une étape « etape-premiere » antérieure (dont le statut est « ko ») est nécessaire pour la création d'une étape « etape-milieu-obligatoire-apres-etape-premiere-cond-simple ».\nUne étape « etape-milieu-obligatoire-apres-etape-premiere-cond-simple » ne peut être créée après une étape « etape-premiere » (dont le statut est « ok »)."
    )
  })

  test('impossibleApres, avec étape interdite antérieure dans la démarche retourne une erreur', () => {
    expect(
      titreEtapeDateValidate(
        ({
          typeId: 'etape-milieu-impossible-apres-etape-derniere',
          date: '5000-01-01'
        } as unknown) as ITitreEtape,
        ({
          type,
          etapes: [
            {
              typeId: 'etape-derniere',
              date: '4000-01-01'
            }
          ]
        } as unknown) as ITitreDemarche,
        ({ typeId: 'arm' } as unknown) as ITitre
      )
    ).toEqual(
      'Une étape « etape-milieu-impossible-apres-etape-derniere » ne peut être créée après une étape « etape-derniere ».'
    )
  })

  test("impossibleApres, avec étape interdite postérieure dans la démarche ne retourne pas d'erreur", () => {
    expect(
      titreEtapeDateValidate(
        ({
          typeId: 'etape-milieu-impossible-apres-etape-derniere',
          date: '3000-01-01'
        } as unknown) as ITitreEtape,
        ({
          type,
          etapes: [
            {
              typeId: 'etape-derniere',
              date: '4000-01-01'
            }
          ]
        } as unknown) as ITitreDemarche,
        ({ typeId: 'arm' } as unknown) as ITitre
      )
    ).toBeNull()
  })

  test('impossibleAvant, avec étape interdite antérieure dans la démarche ne retourne pas une erreur', () => {
    expect(
      titreEtapeDateValidate(
        ({
          typeId: 'etape-milieu-impossible-avant-etape-premiere',
          date: '5000-01-01'
        } as unknown) as ITitreEtape,
        ({
          type,
          etapes: [
            {
              typeId: 'etape-premiere',
              date: '4000-01-01'
            }
          ]
        } as unknown) as ITitreDemarche,
        ({ typeId: 'arm' } as unknown) as ITitre
      )
    ).toBeNull()
  })

  test('impossibleAvant, avec étape interdite postérieure dans la démarche retourne une erreur', () => {
    expect(
      titreEtapeDateValidate(
        ({
          typeId: 'etape-milieu-impossible-avant-etape-premiere',
          date: '3000-01-01'
        } as unknown) as ITitreEtape,
        ({
          type,
          etapes: [
            {
              typeId: 'etape-premiere',
              date: '4000-01-01'
            }
          ]
        } as unknown) as ITitreDemarche,
        ({ typeId: 'arm' } as unknown) as ITitre
      )
    ).toEqual(
      'Une étape « etape-milieu-impossible-avant-etape-premiere » ne peut être créée avant une étape « etape-premiere ».'
    )
  })

  test("impossibleAvant compilé, avec étape interdite antérieure dans la démarche ne retourne pas d'erreur", () => {
    expect(
      titreEtapeDateValidate(
        ({
          typeId: 'etape-derniere',
          date: '5000-01-01'
        } as unknown) as ITitreEtape,
        ({
          type,
          etapes: [
            {
              typeId: 'etape-milieu-impossible-apres-etape-derniere',
              date: '4000-01-01'
            }
          ]
        } as unknown) as ITitreDemarche,
        ({ typeId: 'arm' } as unknown) as ITitre
      )
    ).toBeNull()
  })

  test('impossibleAvant compilé, avec étape interdite postérieure dans la démarche retourne une erreur', () => {
    expect(
      titreEtapeDateValidate(
        ({
          typeId: 'etape-derniere',
          date: '3000-01-01'
        } as unknown) as ITitreEtape,
        ({
          type,
          etapes: [
            {
              typeId: 'etape-milieu-impossible-apres-etape-derniere',
              date: '4000-01-01'
            }
          ]
        } as unknown) as ITitreDemarche,
        ({ typeId: 'arm' } as unknown) as ITitre
      )
    ).toEqual(
      'Une étape « etape-derniere » ne peut être créée avant une étape « etape-milieu-impossible-apres-etape-derniere ».'
    )
  })

  test('obligatoireApres, sans étape obligatoire antérieure pour un titre avec contenu obligatoire dans la démarche retourne une erreur', () => {
    expect(
      titreEtapeDateValidate(
        ({
          typeId: 'etape-mecanise',
          date: '2020-01-01'
        } as unknown) as ITitreEtape,
        ({
          type,
          etapes: [{}]
        } as unknown) as ITitreDemarche,
        ({
          typeId: 'arm',
          contenu: { arm: { mecanise: true } }
        } as unknown) as ITitre
      )
    ).toEqual(
      "Une étape « etape-premiere » antérieure est nécessaire pour la création d'une étape « etape-mecanise »."
    )
  })

  test("obligatoireApres, avec étape obligatoire antérieure pour un titre avec contenu obligatoire dans la démarche ne retourne pas d'erreur", () => {
    expect(
      titreEtapeDateValidate(
        ({
          typeId: 'etape-mecanise',
          date: '2020-01-01'
        } as unknown) as ITitreEtape,
        ({
          type,
          etapes: [{ typeId: 'etape-premiere', date: '2000-01-01' }]
        } as unknown) as ITitreDemarche,
        ({
          typeId: 'arm',
          contenu: { arm: { mecanise: true } }
        } as unknown) as ITitre
      )
    ).toBeNull()
  })
})
