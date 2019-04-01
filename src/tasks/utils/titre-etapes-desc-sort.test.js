import titreEtapesDescSort from './titre-etapes-desc-sort'
import {
  titreEtapesSortedDesc,
  titreEtapesSortedAsc,
  titreEtapesSortedDescResult
} from './__mocks__/titre-etapes-desc-sort-etapes'

describe('trie les étapes', () => {
  test('des étapes organisées par ordre croissant sont triées par ordre décroissant', () => {
    expect(titreEtapesDescSort(titreEtapesSortedAsc)).toMatchObject(
      titreEtapesSortedDescResult
    )
  })

  test('des étapes organisées par ordre décroissant restent triées par ordre décroissant', () => {
    expect(titreEtapesDescSort(titreEtapesSortedDesc)).toMatchObject(
      titreEtapesSortedDescResult
    )
  })
})
