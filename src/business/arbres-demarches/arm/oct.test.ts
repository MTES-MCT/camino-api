import { arbreErreursGet } from '../_utils'

describe('vérifie l’arbre d’octroi d’ARM', () => {
  const octArbreErreursGet = arbreErreursGet('oct', 'arm')

  test.each(['mfr', 'pfd', 'dae', 'rde'])(
    'peut créer une étape "%s" si il n’existe pas d’autres étapes',
    arbreTypeId => {
      expect(octArbreErreursGet([{ arbreTypeId }])).toBeNull()
    }
  )

  test('peut créer une étape "mdp" juste après une "mfr"', () => {
    expect(
      octArbreErreursGet([{ arbreTypeId: 'mfr' }, { arbreTypeId: 'mdp' }])
    ).toBeNull()
  })

  test('ne peut pas créer une étape "mfr" si il y a déjà une "mfr"', () => {
    expect(
      octArbreErreursGet([
        { arbreTypeId: 'mfr' },
        { arbreTypeId: 'mdp' },
        { arbreTypeId: 'mfr' }
      ])
    ).toBeTruthy()
  })

  test('ne peut pas déplacer une étape "mfr" après une "mdp"', () => {
    expect(
      octArbreErreursGet([
        { arbreTypeId: 'mdp', date: '2020-02-02' },
        { arbreTypeId: 'mfr', date: '2020-02-03' }
      ])
    ).toBeTruthy()
  })

  test.each(['rde', 'dae'])(
    'peut créer une étape "%s" juste après une "mdp" et que le titre est mécanisé avec franchissement d’eau',
    arbreTypeId => {
      expect(
        octArbreErreursGet(
          [
            { arbreTypeId: 'mfr', date: '2020-01-01' },
            { arbreTypeId: 'mdp', date: '2020-01-02' },
            { arbreTypeId, date: '2020-01-02' }
          ],
          {
            contenu: { arm: { mecanise: true, franchissements: 1 } }
          }
        )
      ).toBeNull()
    }
  )

  test('peut créer une étape "mcp" après une "mdp"', () => {
    expect(
      octArbreErreursGet([
        { arbreTypeId: 'mcp', date: '2020-02-03' },
        { arbreTypeId: 'mdp', date: '2020-02-02' },
        { arbreTypeId: 'mfr', date: '2020-01-01' }
      ])
    ).toBeNull()
  })

  test('peut créer une "des" après "mdp"', () => {
    expect(
      octArbreErreursGet([
        { arbreTypeId: 'mfr', date: '2020-01-01' },
        { arbreTypeId: 'mdp', date: '2020-01-01' },
        { arbreTypeId: 'des', date: '2020-01-04' }
      ])
    ).toBeNull()
  })

  test('ne peut pas créer deux "des"', () => {
    expect(
      octArbreErreursGet([
        { arbreTypeId: 'mfr', date: '2020-01-01' },
        { arbreTypeId: 'mdp', date: '2020-01-01' },
        { arbreTypeId: 'des', date: '2020-01-04' },
        { arbreTypeId: 'des', date: '2020-01-04' }
      ])
    ).toEqual('L’étape "des" ne peut-être effecutée 2 fois d’affilée')
  })

  test('ne peut pas créer une "css" après une "des"', () => {
    expect(
      octArbreErreursGet([
        { arbreTypeId: 'mfr', date: '2020-01-01' },
        { arbreTypeId: 'mdp', date: '2020-01-01' },
        { arbreTypeId: 'des', date: '2020-01-04' },
        { arbreTypeId: 'css', date: '2020-01-05' }
      ])
    ).toEqual('L’étape "css" n’est plus possible après "des"')
  })

  test('peut créer une "des" si le titre est en attente de "pfc"', () => {
    expect(
      octArbreErreursGet(
        [
          { arbreTypeId: 'mfr', date: '2020-01-01' },
          { arbreTypeId: 'mdp', date: '2020-01-01' },
          { arbreTypeId: 'dae', statutId: 'fav', date: '2020-01-01' },
          { arbreTypeId: 'mcp', date: '2020-01-01', statutId: 'fav' },
          { arbreTypeId: 'vfd', date: '2020-01-01' },
          { arbreTypeId: 'mcr', date: '2020-01-01', statutId: 'fav' },
          { arbreTypeId: 'eof', date: '2020-01-01' },
          { arbreTypeId: 'aof', date: '2020-01-01' },
          { arbreTypeId: 'sca', date: '2020-01-02' },
          { arbreTypeId: 'aca', date: '2020-01-03', statutId: 'fav' },
          { arbreTypeId: 'mno-aca', date: '2020-01-04' },
          { arbreTypeId: 'des', date: '2020-01-04' }
        ],
        {
          contenu: { arm: { mecanise: true } }
        }
      )
    ).toBeNull()
  })

  test('ne peut pas créer une "mno" après la "aca" si le titre n’est pas mécanisé', () => {
    expect(
      octArbreErreursGet([
        { arbreTypeId: 'mfr', date: '2020-01-01' },
        { arbreTypeId: 'mdp', date: '2020-01-01' },
        { arbreTypeId: 'mcp', date: '2020-01-01', statutId: 'fav' },
        { arbreTypeId: 'vfd', date: '2020-01-01' },
        { arbreTypeId: 'mcr', date: '2020-01-01', statutId: 'fav' },
        { arbreTypeId: 'eof', date: '2020-01-01' },
        { arbreTypeId: 'aof', date: '2020-01-01' },
        { arbreTypeId: 'sca', date: '2020-01-02' },
        { arbreTypeId: 'aca', date: '2020-01-03', statutId: 'fav' },
        { arbreTypeId: 'mno-aca', date: '2020-01-04' }
      ])
    ).toEqual('L’étape "mno-aca" n’est pas possible juste après "aca"')
  })

  test('peut créer une "mno-rej" apres une "aca" défavorable', () => {
    expect(
      octArbreErreursGet([
        { arbreTypeId: 'mno-rej', date: '2020-08-18', statutId: 'fai' },
        { arbreTypeId: 'aca', date: '2020-08-18', statutId: 'def' },
        { arbreTypeId: 'sca', date: '2020-08-07', statutId: 'fai' },
        { arbreTypeId: 'aof', date: '2020-06-19', statutId: 'def' },
        { arbreTypeId: 'eof', date: '2020-06-19', statutId: 'fai' },
        { arbreTypeId: 'mcr', date: '2020-06-15', statutId: 'fav' },
        { arbreTypeId: 'vfd', date: '2020-06-15', statutId: 'fai' },
        { arbreTypeId: 'mcp', date: '2020-05-29', statutId: 'fav' },
        { arbreTypeId: 'mdp', date: '2020-05-04', statutId: 'fai' },
        { arbreTypeId: 'pfd', date: '2020-05-01', statutId: 'fai' },
        { arbreTypeId: 'mfr', date: '2020-04-29', statutId: 'fai' }
      ])
    ).toBeNull()
  })
  test('peut créer une "mod" si il n’y a pas de sca', () => {
    expect(
      octArbreErreursGet([
        { arbreTypeId: 'mfr', date: '2019-12-12', statutId: 'fai' },
        { arbreTypeId: 'mdp', date: '2019-12-12', statutId: 'fai' },
        { arbreTypeId: 'pfd', date: '2019-12-12', statutId: 'fai' },
        { arbreTypeId: 'dae', date: '2020-01-14', statutId: 'fav' },
        { arbreTypeId: 'mcp', date: '2020-01-21', statutId: 'fav' },
        { arbreTypeId: 'vfd', date: '2020-02-05', statutId: 'fai' },
        { arbreTypeId: 'mcr', date: '2020-02-05', statutId: 'fav' },
        { arbreTypeId: 'eof', date: '2020-02-05', statutId: 'fai' },
        { arbreTypeId: 'aof', date: '2020-02-05', statutId: 'fav' },
        { arbreTypeId: 'rde', date: '2020-02-11', statutId: 'fav' },
        { arbreTypeId: 'mod', date: '2020-06-17', statutId: 'fai' }
      ])
    ).toBeNull()
  })

  test('peut créer une "mcp" après une "pfd" et "mdp"', () => {
    expect(
      octArbreErreursGet([
        { arbreTypeId: 'mfr', date: '2020-01-30', statutId: 'fai' },
        { arbreTypeId: 'mdp', date: '2020-02-23', statutId: 'fai' },
        { arbreTypeId: 'pfd', date: '2020-02-23', statutId: 'fai' },
        { arbreTypeId: 'mcp', date: '2020-02-28', statutId: 'fav' }
      ])
    ).toBeNull()
  })

  test('peut créer une "sca" après une "aof" et "rde"', () => {
    expect(
      octArbreErreursGet(
        [
          { arbreTypeId: 'dae', date: '2020-06-22', statutId: 'fav' },
          { arbreTypeId: 'mfr', date: '2020-07-09', statutId: 'fai' },
          { arbreTypeId: 'pfd', date: '2020-07-10', statutId: 'fai' },
          { arbreTypeId: 'mdp', date: '2020-07-17', statutId: 'fai' },
          { arbreTypeId: 'mcp', date: '2020-07-17', statutId: 'fav' },
          { arbreTypeId: 'rde', date: '2020-07-30', statutId: 'fav' },
          { arbreTypeId: 'vfd', date: '2020-07-31', statutId: 'fai' },
          { arbreTypeId: 'mcr', date: '2020-07-31', statutId: 'fav' },
          { arbreTypeId: 'eof', date: '2020-08-10', statutId: 'fai' },
          { arbreTypeId: 'aof', date: '2020-08-10', statutId: 'fav' },
          { arbreTypeId: 'sca', date: '2020-09-04', statutId: 'fai' }
        ],
        {
          contenu: { arm: { mecanise: true, franchissements: 3 } }
        }
      )
    ).toBeNull()
  })
})
