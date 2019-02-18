import titreEtapesAscSort from './titre-etapes-asc-sort'
import {
  titreEtapesSortedAsc,
  titreEtapesSortedDesc,
  titreEtapesSortedAscResult
} from './__mocks__/titre-etapes-asc-sort-etapes'

test('des étapes organisées par ordre décroissant sont triées par ordre croissant', () => {
  expect(titreEtapesAscSort(titreEtapesSortedDesc)).toMatchObject(
    titreEtapesSortedAscResult
  )
})

test('des étapes organisées par ordre croissant restent triées par ordre croissant', () => {
  expect(titreEtapesAscSort(titreEtapesSortedAsc)).toMatchObject(
    titreEtapesSortedAscResult
  )
})
