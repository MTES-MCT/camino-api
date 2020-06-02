import { ITitreEtape, ITitre } from '../../types'

import titreEtapePropFind from './titre-etape-prop-find'

describe("valeur d'une propriété pour une étape", () => {
  test('retourne null si le titre ne contient pas de propriété "demarches"', () => {
    expect(
      titreEtapePropFind(
        'titulaires',
        ({} as unknown) as ITitreEtape,
        ([] as unknown) as ITitreEtape[],
        ({} as unknown) as ITitre
      )
    ).toEqual(null)
  })

  test('retourne null si le titre ne contient pas de démarches', () => {
    expect(
      titreEtapePropFind(
        'titulaires',
        ({} as unknown) as ITitreEtape,
        ([] as unknown) as ITitreEtape[],
        ({ demarches: [] } as unknown) as ITitre
      )
    ).toEqual(null)
  })
})
