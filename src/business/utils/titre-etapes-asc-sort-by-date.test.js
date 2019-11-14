import titreEtapesAscSortByDate from './titre-etapes-asc-sort-by-date'
import {
  titreEtapesSortedAsc,
  titreEtapesSortedDesc,
  titreEtapesSortedAscResult,
  titreEtapesMemesDatesOrdreDesc,
  titreEtapesMemesDatesOrdreAscResult,
  titreEtapesMemesDatesMemeOrdreDesc,
  titreEtapesMemesDatesMemeOrdreAscResult,
  etapesTypes
} from './__mocks__/titre-etapes-asc-sort-by-date-etapes'

describe('trie les étapes', () => {
  test('des étapes organisées par date décroissante sont triées par date croissante', () => {
    expect(titreEtapesAscSortByDate(titreEtapesSortedDesc)).toMatchObject(
      titreEtapesSortedAscResult
    )
  })

  test('des étapes organisées par date croissante restent triées par date croissante', () => {
    expect(titreEtapesAscSortByDate(titreEtapesSortedAsc)).toMatchObject(
      titreEtapesSortedAscResult
    )
  })

  test('des étapes avec les mêmes dates organisées par ordre décroissant sont triées par ordre croissant', () => {
    expect(
      titreEtapesAscSortByDate(titreEtapesMemesDatesOrdreDesc)
    ).toMatchObject(titreEtapesMemesDatesOrdreAscResult)
  })

  test('des étapes avec les mêmes dates et le même ordre sont triées par ordre de type croissant', () => {
    expect(
      titreEtapesAscSortByDate(titreEtapesMemesDatesMemeOrdreDesc, {
        etapesTypes
      })
    ).toMatchObject(titreEtapesMemesDatesMemeOrdreAscResult)
  })
})
