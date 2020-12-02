import titreDemarchesSortAsc from './titre-elements-sort-asc'
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
      titreDemarchesSortAsc(titreDemarchesNoEtapesSortedDesc)
    ).toMatchObject(titreDemarchesNoEtapesSortedDescResult)
  })

  test('des démarches sans étapes orgqnisées par ordre croissant sont triées par ordre croissant', () => {
    expect(
      titreDemarchesSortAsc(titreDemarchesNoEtapesSortedAsc)
    ).toMatchObject(titreDemarchesNoEtapesSortedAscResult)
  })

  test('des démarches organisées par ordre décroissant sont triées par ordre croissant', () => {
    expect(titreDemarchesSortAsc(titreDemarchesSortedDesc)).toMatchObject(
      titreDemarchesSortedAscResult
    )
  })

  test('des démarches organisées par ordre croissant restent triées par ordre croissant', () => {
    expect(titreDemarchesSortAsc(titreDemarchesSortedAsc)).toMatchObject(
      titreDemarchesSortedAscResult
    )
  })

  test('des démarches dont les dates sont les mêmes restent triées dans le même ordre', () => {
    expect(titreDemarchesSortAsc(titreDemarchesSortedDescEqual)).toMatchObject(
      titreDemarchesSortedDescEqualResult
    )
  })
})
