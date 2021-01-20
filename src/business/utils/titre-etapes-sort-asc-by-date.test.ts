import { IDemarcheType, ITitreEtape } from '../../types'
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

console.error = jest.fn()
describe('trie les étapes', () => {
  test('des étapes organisées par date décroissante sont triées par date croissante', () => {
    expect(
      titreEtapesSortAscByDate(titreEtapesSortedDesc, 'demarches')
    ).toMatchObject(titreEtapesSortedAscResult)
  })

  test('des étapes organisées par date croissante restent triées par date croissante', () => {
    expect(
      titreEtapesSortAscByDate(titreEtapesSortedAsc, 'demarches')
    ).toMatchObject(titreEtapesSortedAscResult)
  })

  test('des étapes avec les mêmes dates organisées par ordre décroissant sont triées par ordre croissant', () => {
    expect(
      titreEtapesSortAscByDate(titreEtapesMemesDatesOrdreDesc, 'demarches')
    ).toMatchObject(titreEtapesMemesDatesOrdreAscResult)
  })

  test('des étapes avec les mêmes dates sont triées par ordre de type croissant', () => {
    expect(
      titreEtapesSortAscByDate(
        titreEtapesMemesDatesOrdreEtapesTypesDesc,
        'demarches',
        {
          etapesTypes
        } as IDemarcheType
      )
    ).toMatchObject(titreEtapesMemesDatesOrdreEtapesTypesAscResult)
  })

  test('des étapes avec les mêmes dates sont triées par ordre croissant', () => {
    expect(
      titreEtapesSortAscByDate(
        titreEtapesMemesDatesMemeOrdreDesc,
        'demarches',
        {
          etapesTypes
        } as IDemarcheType
      )
    ).toMatchObject(titreEtapesMemesDatesMemeOrdreAscResult)
  })

  test('tri selon l’arbre si les étapes ont la même date', () => {
    const etapes = [
      { typeId: 'mcr', date: '2020-01-01', ordre: 18 },
      { typeId: 'vfd', date: '2020-01-01', ordre: 23 },
      { typeId: 'eof', date: '2020-01-01', ordre: 36 }
    ] as ITitreEtape[]

    const result = titreEtapesSortAscByDate(
      etapes,
      'demarches',
      { id: 'oct' } as IDemarcheType,
      'arm'
    )
    expect(result[0].typeId).toEqual('vfd')
    expect(result[1].typeId).toEqual('mcr')
    expect(result[2].typeId).toEqual('eof')
  })

  test('la "mnv" doit être après la "aco"', () => {
    const etapes = [
      { typeId: 'mnv', date: '2020-01-01', ordre: 119 },
      { typeId: 'aco', date: '2020-01-01', ordre: 125 }
    ] as ITitreEtape[]

    const result = titreEtapesSortAscByDate(
      etapes,
      'demarches',
      { id: 'pro' } as IDemarcheType,
      'arm'
    )
    expect(result[0].typeId).toEqual('aco')
    expect(result[1].typeId).toEqual('mnv')
  })

  test("loggue une erreur si le type d'étape est absent dans la définition", () => {
    const etapes = [
      { typeId: 'mcr', date: '2020-01-01', ordre: 18 },
      { typeId: 'bof', date: '2020-01-01', ordre: 23 },
      { typeId: 'vfd', date: '2020-01-01', ordre: 36 }
    ] as ITitreEtape[]

    const result = titreEtapesSortAscByDate(
      etapes,
      'demarches',
      { id: 'oct' } as IDemarcheType,
      'arm'
    )
    expect(console.error).toHaveBeenCalledTimes(2)
    expect(result[0].typeId).toEqual('vfd')
    expect(result[1].typeId).toEqual('bof')
    expect(result[2].typeId).toEqual('mcr')
  })
})
