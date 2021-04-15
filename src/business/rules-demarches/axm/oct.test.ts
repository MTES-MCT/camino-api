import { demarcheEtatsValidate } from '../_utils.test'

describe('vérifie l’arbre d’octroi d’AXM', () => {
  const octEtatsValidate = demarcheEtatsValidate('oct', 'axm')

  test('peut créer une "mdp" après une "mfr"', () => {
    expect(
      octEtatsValidate([
        { typeId: 'mfr', date: '2020-01-01' },
        { typeId: 'dae', statutId: 'exe', date: '2020-01-01' },
        { typeId: 'mdp', date: '2020-01-02' }
      ])
    ).toHaveLength(0)
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
        { typeId: 'dae', statutId: 'exe', date: '2020-01-01' },
        { typeId: 'nis', date: '2020-01-02' },
        { typeId: 'mdp', date: '2020-01-03' }
      ])
    ).toHaveLength(0)
  })

  test('ne peut pas créer 2 étapes "mdp"', () => {
    expect(
      octEtatsValidate([
        { typeId: 'mfr', date: '2020-01-01' },
        { typeId: 'dae', statutId: 'exe', date: '2020-01-01' },
        { typeId: 'mdp', date: '2020-01-02' },
        { typeId: 'mca', date: '2020-01-03' },
        { typeId: 'mdp', date: '2020-01-04' }
      ])
    ).toEqual(['l’étape "mdp" n’est plus possible après "mfr", "mca"'])
  })

  test('ne peut pas avoir juste une étape "Décision de l’administration"', () => {
    expect(octEtatsValidate([{ typeId: 'dex', date: '2020-08-21' }])).toEqual([
      'l’étape "dex" n’est pas possible juste après '
    ])
  })

  test('ne peut pas créer une "mdp" sans une "dae"', () => {
    expect(
      octEtatsValidate([
        { typeId: 'mfr', date: '2020-01-01' },
        { typeId: 'mdp', date: '2020-01-02' }
      ])
    ).toContain('l’étape "mdp" n’est pas possible juste après "mfr"')
  })

  test('ne peut pas créer une "mdp" sans une "dae" requis', () => {
    expect(
      octEtatsValidate([
        { typeId: 'mfr', date: '2020-01-01' },
        { typeId: 'dae', statutId: 'req', date: '2020-01-01' },
        { typeId: 'mdp', date: '2020-01-02' }
      ])
    ).toContain('l’étape "mdp" n’est pas possible juste après "mfr", "dae"')
  })

  test('peut créer une faire une "mno", une "rpu" et une "pqr" à la fin de la démarche', () => {
    expect(
      octEtatsValidate([
        { typeId: 'mfr', date: '2020-01-01' },
        { typeId: 'dae', statutId: 'exe', date: '2020-01-01' },
        { typeId: 'mdp', date: '2020-01-02' },
        { typeId: 'asl', statutId: 'fav', date: '2020-01-02' },
        { typeId: 'mcr', statutId: 'fav', date: '2020-01-03' },
        { typeId: 'scl', date: '2020-01-04' },
        { typeId: 'ama', date: '2020-01-05' },
        { typeId: 'ssr', date: '2020-01-04' },
        { typeId: 'cps', date: '2020-01-05' },
        { typeId: 'apd', date: '2020-01-06' },
        { typeId: 'spo', date: '2020-01-07' },
        { typeId: 'apo', statutId: 'fav', date: '2020-01-08' },
        { typeId: 'sas', date: '2020-01-08' },
        { typeId: 'dex', statutId: 'acc', date: '2020-01-09' },
        { typeId: 'mno', date: '2020-01-10' },
        { typeId: 'pqr', date: '2020-01-10' },
        { typeId: 'rpu', date: '2020-01-10' }
      ])
    ).toHaveLength(0)
  })

  test('ne peut créer une faire une "mno" et une "abd" à la fin de la démarche', () => {
    expect(
      octEtatsValidate([
        { typeId: 'mfr', date: '2020-01-01' },
        { typeId: 'dae', statutId: 'exe', date: '2020-01-01' },
        { typeId: 'mdp', date: '2020-01-02' },
        { typeId: 'asl', statutId: 'fav', date: '2020-01-02' },
        { typeId: 'mcr', statutId: 'fav', date: '2020-01-03' },
        { typeId: 'scl', date: '2020-01-04' },
        { typeId: 'ama', date: '2020-01-05' },
        { typeId: 'ssr', date: '2020-01-04' },
        { typeId: 'cps', date: '2020-01-05' },
        { typeId: 'apd', date: '2020-01-06' },
        { typeId: 'spo', date: '2020-01-07' },
        { typeId: 'apo', statutId: 'fav', date: '2020-01-08' },
        { typeId: 'sas', date: '2020-01-08' },
        { typeId: 'dex', statutId: 'acc', date: '2020-01-09' },
        { typeId: 'abd', date: '2020-01-10' },
        { typeId: 'mno', date: '2020-01-11' }
      ])
    ).toContain('l’étape "mno" n’est plus possible après "ama", "dex", "abd"')
  })

  test('ne peut créer une faire une "rtd" et une "abd" à la fin de la démarche', () => {
    expect(
      octEtatsValidate([
        { typeId: 'mfr', date: '2020-01-01' },
        { typeId: 'dae', statutId: 'exe', date: '2020-01-01' },
        { typeId: 'mdp', date: '2020-01-02' },
        { typeId: 'asl', statutId: 'fav', date: '2020-01-02' },
        { typeId: 'mcr', statutId: 'fav', date: '2020-01-03' },
        { typeId: 'scl', date: '2020-01-04' },
        { typeId: 'ama', date: '2020-01-05' },
        { typeId: 'ssr', date: '2020-01-04' },
        { typeId: 'cps', date: '2020-01-05' },
        { typeId: 'apd', date: '2020-01-06' },
        { typeId: 'spo', date: '2020-01-07' },
        { typeId: 'apo', statutId: 'fav', date: '2020-01-08' },
        { typeId: 'sas', date: '2020-01-08' },
        { typeId: 'dex', statutId: 'acc', date: '2020-01-09' },
        { typeId: 'abd', date: '2020-01-10' },
        { typeId: 'rtd', date: '2020-01-11' }
      ])
    ).toContain('l’étape "rtd" n’est plus possible après "ama", "dex", "abd"')
  })
})
