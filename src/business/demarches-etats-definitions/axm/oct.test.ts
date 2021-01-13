import { demarcheEtatsValidate } from '../_utils-test'

describe('vérifie l’arbre d’octroi d’AXM', () => {
  const octEtatsValidate = demarcheEtatsValidate('oct', 'axm')

  test('peut créer une "mdp" après une "mfr"', () => {
    expect(
      octEtatsValidate([
        { typeId: 'mfr', date: '2020-01-01' },
        { typeId: 'mdp', date: '2020-01-02' }
      ])
    ).toBeNull()
  })

  test('ne peut pas créer une "mis" sans "mfr"', () => {
    expect(octEtatsValidate([{ typeId: 'nis', date: '2020-01-01' }])).toEqual([
      'l’étape "nis" n’est pas possible après '
    ])
  })

  test('peut créer une "nis" après une "mfr"', () => {
    expect(
      octEtatsValidate([
        { typeId: 'mfr', date: '2020-01-01' },
        { typeId: 'nis', date: '2020-01-02' },
        { typeId: 'mdp', date: '2020-01-03' }
      ])
    ).toBeNull()
  })

  test('ne peut pas créer 2 étapes "mdp"', () => {
    expect(
      octEtatsValidate([
        { typeId: 'mfr', date: '2020-01-01' },
        { typeId: 'mdp', date: '2020-01-02' },
        { typeId: 'mca', date: '2020-01-03' },
        { typeId: 'mdp', date: '2020-01-04' }
      ])
    ).toEqual(['l’étape "mdp" n’est plus possible après "mfr", "mca"'])
  })
})
