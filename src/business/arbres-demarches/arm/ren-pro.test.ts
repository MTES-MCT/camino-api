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

  test('ne peut pas faire de "mod" après une "mcr"', () => {
    expect(
      renProArbreErreursGet([
        { arbreTypeId: 'mfr', date: '2020-05-27' },
        { arbreTypeId: 'mdp', date: '2020-05-30' },
        { arbreTypeId: 'mcr', date: '2020-06-01' },
        { arbreTypeId: 'mod', date: '2020-06-03' }
      ])
    ).toBeNull()
  })

  test('ne peut pas faire 2 "mco" d’affilée', () => {
    expect(
      renProArbreErreursGet([
        { arbreTypeId: 'mfr', date: '2020-05-27' },
        { arbreTypeId: 'mdp', date: '2020-05-30' },
        { arbreTypeId: 'mco-mcr', date: '2020-06-03' },
        { arbreTypeId: 'mco-mcr' }
      ])
    ).toContain('L’étape "mco-mcr" ne peut-être effecutée 2 fois d’affilée')
  })
})
