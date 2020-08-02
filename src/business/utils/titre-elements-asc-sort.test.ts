import titreDemarchesAscSort from './titre-elements-asc-sort'
import {
  titreDemarchesNoEtapesSortedAsc,
  titreDemarchesNoEtapesSortedDesc,
  titreDemarchesNoEtapesSortedAscResult,
  titreDemarchesNoEtapesSortedDescResult,
  titreDemarchesSortedAsc,
  titreDemarchesSortedDesc,
  titreDemarchesSortedAscResult,
  titreDemarchesSortedDescEqual,
  titreDemarchesSortedDescEqualResult
} from './__mocks__/titre-demarches-asc-sort-demarches'

describe('trie les démarches', () => {
  test('des démarches sans étapes organisées par ordre décroissant sont triées par ordre croissant', () => {
    expect(
      titreDemarchesAscSort(titreDemarchesNoEtapesSortedDesc)
    ).toMatchObject(titreDemarchesNoEtapesSortedDescResult)
  })

  test('des démarches sans étapes orgqnisées par ordre croissant sont triées par ordre croissant', () => {
    expect(
      titreDemarchesAscSort(titreDemarchesNoEtapesSortedAsc)
    ).toMatchObject(titreDemarchesNoEtapesSortedAscResult)
  })

  test('des démarches organisées par ordre décroissant sont triées par ordre croissant', () => {
    expect(titreDemarchesAscSort(titreDemarchesSortedDesc)).toMatchObject(
      titreDemarchesSortedAscResult
    )
  })

  test('des démarches organisées par ordre croissant restent triées par ordre croissant', () => {
    expect(titreDemarchesAscSort(titreDemarchesSortedAsc)).toMatchObject(
      titreDemarchesSortedAscResult
    )
  })

  test('des démarches dont les dates sont les mêmes restent triées dans le même ordre', () => {
    expect(titreDemarchesAscSort(titreDemarchesSortedDescEqual)).toMatchObject(
      titreDemarchesSortedDescEqualResult
    )
  })
})
