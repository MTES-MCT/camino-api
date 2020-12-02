import titreEtapesSortAscByDate from './titre-etapes-sort-asc-by-date'
import {
  titreEtapesSortedAsc,
  titreEtapesSortedDesc,
  titreEtapesSortedAscResult,
  titreEtapesMemesDatesOrdreDesc,
  titreEtapesMemesDatesOrdreAscResult,
  titreEtapesMemesDatesOrdreEtapesTypesDesc,
  titreEtapesMemesDatesOrdreEtapesTypesAscResult,
  titreEtapesMemesDatesMemeOrdreDesc,
  titreEtapesMemesDatesMemeOrdreAscResult,
  etapesTypes
} from './__mocks__/titre-etapes-asc-sort-by-date-etapes'
import { IDemarcheType } from '../../types'

describe('trie les étapes', () => {
  test('des étapes organisées par date décroissante sont triées par date croissante', () => {
    expect(titreEtapesSortAscByDate(titreEtapesSortedDesc)).toMatchObject(
      titreEtapesSortedAscResult
    )
  })

  test('des étapes organisées par date croissante restent triées par date croissante', () => {
    expect(titreEtapesSortAscByDate(titreEtapesSortedAsc)).toMatchObject(
      titreEtapesSortedAscResult
    )
  })

  test('des étapes avec les mêmes dates organisées par ordre décroissant sont triées par ordre croissant', () => {
    expect(
      titreEtapesSortAscByDate(titreEtapesMemesDatesOrdreDesc)
    ).toMatchObject(titreEtapesMemesDatesOrdreAscResult)
  })

  test('des étapes avec les mêmes dates sont triées par ordre de type croissant', () => {
    expect(
      titreEtapesSortAscByDate(titreEtapesMemesDatesOrdreEtapesTypesDesc, {
        etapesTypes
      } as IDemarcheType)
    ).toMatchObject(titreEtapesMemesDatesOrdreEtapesTypesAscResult)
  })

  test('des étapes avec les mêmes dates sont triées par ordre croissant', () => {
    expect(
      titreEtapesSortAscByDate(titreEtapesMemesDatesMemeOrdreDesc, {
        etapesTypes
      } as IDemarcheType)
    ).toMatchObject(titreEtapesMemesDatesMemeOrdreAscResult)
  })
})
