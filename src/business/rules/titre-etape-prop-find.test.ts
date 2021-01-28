import { ITitreEtape, ITitreDemarche } from '../../types'

import { titreEtapePropFind } from './titre-etape-prop-find'

console.error = jest.fn()

describe("valeur d'une propriété pour une étape", () => {
  const aujourdhui = '2020-12-01'
  test('retourne null si le titre ne contient pas de propriété "demarches"', () => {
    expect(
      titreEtapePropFind(
        'titulaires',
        ({} as unknown) as ITitreEtape,
        ([] as unknown) as ITitreEtape[],
        aujourdhui,
        undefined
      )
    ).toEqual(null)
  })

  test('retourne null si le titre ne contient pas de démarches', () => {
    expect(
      titreEtapePropFind(
        'titulaires',
        ({} as unknown) as ITitreEtape,
        ([] as unknown) as ITitreEtape[],
        aujourdhui,
        ([] as unknown) as ITitreDemarche[]
      )
    ).toEqual(null)
  })

  test('retourne une erreur si le titre contient une démarche mal formatée', () => {
    expect(() =>
      titreEtapePropFind(
        'titulaires',
        ({} as unknown) as ITitreEtape,
        ([] as unknown) as ITitreEtape[],
        aujourdhui,
        ([{ etapes: {} }] as unknown) as ITitreDemarche[]
      )
    ).toThrow(/is not a function/)
    expect(console.error).toHaveBeenCalled()
  })

  test('retourne null si le titre ne contient pas de démarche avec des étapes', () => {
    expect(
      titreEtapePropFind(
        'titulaires',
        ({} as unknown) as ITitreEtape,
        ([] as unknown) as ITitreEtape[],
        aujourdhui,
        ([{}, { etapes: [] }] as unknown) as ITitreDemarche[]
      )
    ).toEqual(null)
  })

  test("retourne la propriété de l'étape antérieure qui contient la propriété voulue", () => {
    expect(
      titreEtapePropFind(
        'titulaires',
        ({ date: '1000-01-01' } as unknown) as ITitreEtape,
        ([
          {
            id: 'demarche-01-etape-01',
            date: '1000-01-01',
            titulaires: []
          },
          {
            id: 'demarche-01-etape-02',
            date: '1000-01-01',
            titulaires: [{ id: 'fr-xxxxxxxxx' }]
          }
        ] as unknown) as ITitreEtape[],
        aujourdhui,
        undefined
      )
    ).toEqual([{ id: 'fr-xxxxxxxxx' }])
  })

  test("retourne la propriété de l'étape antérieure qui contient la propriété voulue", () => {
    expect(
      titreEtapePropFind(
        'titulaires',
        ({ date: '1000-01-01' } as unknown) as ITitreEtape,
        [],
        aujourdhui,
        ([
          {
            id: 'demarche-01',
            etapes: [
              {
                id: 'demarche-01-etape-01',
                date: '1000-01-01'
              }
            ]
          },
          {
            typeId: 'oct',
            etapes: [
              {
                id: 'demarche-02-etape-01',
                date: '1000-01-01',
                statutId: 'acc',
                titulaires: [{ id: 'fr-xxxxxxxxx' }]
              }
            ]
          }
        ] as unknown) as ITitreDemarche[]
      )
    ).toEqual([{ id: 'fr-xxxxxxxxx' }])
  })
})
