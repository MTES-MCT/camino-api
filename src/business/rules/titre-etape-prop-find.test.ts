import { ITitreDemarche } from '../../types'

import { titreEtapePropFind } from './titre-etape-prop-find'

console.error = jest.fn()

describe("valeur d'une propriété pour une étape", () => {
  const date = '2020-12-01'

  test('retourne null si le titre ne contient pas de démarches', () => {
    expect(
      titreEtapePropFind(
        'titulaires',
        date,
        [] as unknown as ITitreDemarche[],
        'pxm'
      )
    ).toEqual(null)
  })

  test('retourne null si le titre ne contient pas de démarche avec des étapes', () => {
    expect(
      titreEtapePropFind(
        'titulaires',
        date,
        [{}, { etapes: [] }] as unknown as ITitreDemarche[],
        'pxm'
      )
    ).toEqual(null)
  })

  test("retourne la propriété de l'étape antérieure qui contient la propriété voulue", () => {
    expect(
      titreEtapePropFind(
        'titulaires',
        date,
        [
          {
            id: 'demarche-01',
            type: { id: 'oct' },
            typeId: 'oct',
            etapes: [
              {
                id: 'demarche-01-etape-01',
                statutId: 'acc',
                date: '1000-01-01',
                titulaires: []
              },
              {
                id: 'demarche-01-etape-02',
                statutId: 'acc',
                date: '1000-01-01',
                titulaires: [{ id: 'fr-xxxxxxxxx' }]
              }
            ]
          }
        ] as ITitreDemarche[],
        'pxm'
      )
    ).toEqual([{ id: 'fr-xxxxxxxxx' }])
  })

  test("retourne la propriété de l'étape antérieure qui contient la propriété voulue", () => {
    expect(
      titreEtapePropFind(
        'surface',
        date,
        [
          {
            id: 'demarche-01',
            statutId: 'acc',
            type: { id: 'oct' },
            etapes: [
              {
                id: 'demarche-01-etape-01',
                date: '1000-01-01'
              }
            ]
          },
          {
            type: { id: 'oct' },
            typeId: 'oct',
            etapes: [
              {
                id: 'demarche-02-etape-01',
                date: '1000-01-01',
                statutId: 'acc',
                surface: 0
              }
            ]
          }
        ] as unknown as ITitreDemarche[],
        'pxm'
      )
    ).toEqual(0)
  })

  test("retourne null si la propriété n'a pas de valeur", () => {
    expect(
      titreEtapePropFind(
        'titulaires',
        date,
        [
          {
            id: 'demarche-01',
            typeId: 'oct',
            type: { id: 'oct' },
            etapes: [
              {
                id: 'demarche-02-etape-01',
                date: '1000-01-01',
                statutId: 'acc',
                titulaires: null
              }
            ]
          }
        ] as unknown as ITitreDemarche[],
        'pxm'
      )
    ).toBeNull()
  })
})
