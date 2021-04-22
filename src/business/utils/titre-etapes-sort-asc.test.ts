import titreEtapesSortAscByOrdre from './titre-etapes-sort-asc'

import {
  titreEtapesSortedAsc,
  titreEtapesSortedDesc,
  titreEtapesSortedAscResult
} from './__mocks__/titre-etapes-asc-sort-etapes'

describe('trie les étapes', () => {
  test('des étapes organisées par ordre décroissant sont triées par ordre croissant', () => {
    expect(titreEtapesSortAscByOrdre(titreEtapesSortedDesc)).toMatchObject(
      titreEtapesSortedAscResult
    )
  })

  test('des étapes organisées par ordre croissant restent triées par ordre croissant', () => {
    expect(titreEtapesSortAscByOrdre(titreEtapesSortedAsc)).toMatchObject(
      titreEtapesSortedAscResult
    )
  })
})
