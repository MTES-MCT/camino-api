import { demarcheEtatsValidate } from '../_utils'

describe('vérifie l’arbre de renonciation et de prolongation d’ARM', () => {
  const renProEtatsValidate = demarcheEtatsValidate('ren', 'arm')

  test('peut créer une étape "mdp" après une "mfr"', () => {
    expect(
      renProEtatsValidate([
        { etatId: 'mfr', date: '2020-05-27' },
        { etatId: 'mdp', date: '2020-05-30' }
      ])
    ).toBeNull()
  })

  test('ne peut pas faire de "mod" après une "mcr"', () => {
    expect(
      renProEtatsValidate([
        { etatId: 'mfr', date: '2020-05-27' },
        { etatId: 'mdp', date: '2020-05-30' },
        { etatId: 'mcr', date: '2020-06-01' },
        { etatId: 'mod', date: '2020-06-03' }
      ])
    ).toContain('L’étape "mod" n’est pas possible juste après "mcr"')
  })

  test('ne peut pas faire 2 "mco" d’affilée', () => {
    expect(
      renProEtatsValidate([
        { etatId: 'mfr', date: '2020-05-27' },
        { etatId: 'mdp', date: '2020-05-30' },
        { etatId: 'mco-mcr', date: '2020-06-03' },
        { etatId: 'mco-mcr' }
      ])
    ).toContain('L’étape "mco-mcr" ne peut-être effecutée 2 fois d’affilée')
  })
})
