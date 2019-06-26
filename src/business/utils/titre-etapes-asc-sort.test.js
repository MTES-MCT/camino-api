import titreEtapesAscSortByOrdre from './titre-etapes-asc-sort'
import {
  titreEtapesSortedAsc,
  titreEtapesSortedDesc,
  titreEtapesSortedAscResult
} from './__mocks__/titre-etapes-asc-sort-etapes'

describe('trie les étapes', () => {
  test('des étapes organisées par ordre décroissant sont triées par ordre croissant', () => {
    expect(titreEtapesAscSortByOrdre(titreEtapesSortedDesc)).toMatchObject(
      titreEtapesSortedAscResult
    )
  })

  test('des étapes organisées par ordre croissant restent triées par ordre croissant', () => {
    expect(titreEtapesAscSortByOrdre(titreEtapesSortedAsc)).toMatchObject(
      titreEtapesSortedAscResult
    )
  })
})
