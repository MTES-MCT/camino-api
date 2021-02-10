import { ITitreDemarche } from '../../../types'
import { titreContenuFormat } from './titre-contenu'

describe('formatage du contenu', () => {
  test("formate le contenu d'un titre", () => {
    expect(
      titreContenuFormat(
        {
          section: { prop1: 'etape-id', prop2: 'etape-id' }
        },
        [
          ({
            id: 'demarche-id',
            etapes: [
              {
                id: 'etape-id',
                contenu: {
                  section: {
                    prop1: 'valeur 1',
                    prop2: 'valeur 2'
                  }
                }
              }
            ]
          } as unknown) as ITitreDemarche
        ]
      )
    ).toMatchObject({ section: { prop1: 'valeur 1', prop2: 'valeur 2' } })
  })

  test("retourne un contenu vide si le trire n'a pas de démarches ou d'étapes", () => {
    expect(
      titreContenuFormat({ section: { prop: 'etape-id' } }, null)
    ).toMatchObject({})

    expect(
      titreContenuFormat(
        { section: { prop: 'etape-id' } },
        [] as ITitreDemarche[]
      )
    ).toMatchObject({})

    expect(
      titreContenuFormat({ section: { prop: 'etape-id' } }, [
        ({ id: 'demarche-id', etapes: null } as unknown) as ITitreDemarche
      ])
    ).toMatchObject({})

    expect(
      titreContenuFormat({ section: { prop: 'etape-id' } }, [
        ({ id: 'demarche-id', etapes: [] } as unknown) as ITitreDemarche
      ])
    ).toMatchObject({})
  })
})
