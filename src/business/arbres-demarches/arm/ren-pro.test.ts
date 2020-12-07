import { arbreErreursGet } from '../_utils'

describe('vérifie l’arbre de renonciation et de prolongation d’ARM', () => {
  const renProArbreErreursGet = arbreErreursGet('ren', 'arm')

  test('peut créer une étape "mdp" après une "mfr"', () => {
    expect(
      renProArbreErreursGet([
        { arbreTypeId: 'mfr', date: '2020-05-27' },
        { arbreTypeId: 'mdp', date: '2020-05-30' }
      ])
    ).toBeNull()
  })
})
