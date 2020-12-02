import titreEtapesSortDesc from './titre-etapes-sort-desc'
import {
  titreEtapesSortedDesc,
  titreEtapesSortedAsc,
  titreEtapesSortedDescResult
} from './__mocks__/titre-etapes-desc-sort-etapes'

describe('trie les étapes', () => {
  test('des étapes organisées par ordre croissant sont triées par ordre décroissant', () => {
    expect(titreEtapesSortDesc(titreEtapesSortedAsc)).toMatchObject(
      titreEtapesSortedDescResult
    )
  })

  test('des étapes organisées par ordre décroissant restent triées par ordre décroissant', () => {
    expect(titreEtapesSortDesc(titreEtapesSortedDesc)).toMatchObject(
      titreEtapesSortedDescResult
    )
  })
})
