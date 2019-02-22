import titreEtapesDescSortByOrdre from './titre-etapes-desc-sort-by-ordre'
import {
  titreEtapesSortedDesc,
  titreEtapesSortedAsc,
  titreEtapesSortedDescResult
} from './__mocks__/titre-etapes-desc-sort-by-ordre-etapes'

describe('trie les étapes', () => {
  test('des étapes organisées par ordre croissant sont triées par ordre décroissant', () => {
    expect(titreEtapesDescSortByOrdre(titreEtapesSortedAsc)).toMatchObject(
      titreEtapesSortedDescResult
    )
  })

  test('des étapes organisées par ordre décroissant restent triées par ordre décroissant', () => {
    expect(titreEtapesDescSortByOrdre(titreEtapesSortedDesc)).toMatchObject(
      titreEtapesSortedDescResult
    )
  })
})
