import { demarcheEtatsValidate } from '../_utils'

describe('vérifie l’arbre d’octroi d’ARM', () => {
  const octEtatsValidate = demarcheEtatsValidate('oct', 'arm')

  test.each(['mfr', 'pfd', 'dae', 'rde'])(
    'peut créer une étape "%s" si il n’existe pas d’autres étapes',
    etatId => {
      expect(octEtatsValidate([{ etatId }])).toBeNull()
    }
  )

  test('peut créer une étape "mdp" juste après une "mfr"', () => {
    expect(octEtatsValidate([{ etatId: 'mfr' }, { etatId: 'mdp' }])).toBeNull()
  })

  test('ne peut pas créer 2 "mfr"', () => {
    expect(
      octEtatsValidate([
        { etatId: 'mfr', date: '2020-01-01' },
        { etatId: 'mdp', date: '2020-01-02' },
        { etatId: 'mfr', date: '2020-01-03' }
      ])
    ).toEqual('L’étape "mfr" existe déjà')
  })

  test('ne peut pas créer une étape "mfr" si il y a déjà une "mfr"', () => {
    expect(
      octEtatsValidate([
        { etatId: 'mfr' },
        { etatId: 'mdp' },
        { etatId: 'mfr' }
      ])
    ).toBeTruthy()
  })

  test('ne peut pas déplacer une étape "mfr" après une "mdp"', () => {
    expect(
      octEtatsValidate([
        { etatId: 'mdp', date: '2020-02-02' },
        { etatId: 'mfr', date: '2020-02-03' }
      ])
    ).toBeTruthy()
  })

  test.each(['rde', 'dae'])(
    'peut créer une étape "%s" juste après une "mdp" et que le titre est mécanisé avec franchissement d’eau',
    etatId => {
      expect(
        octEtatsValidate(
          [
            { etatId: 'mfr', date: '2020-01-01' },
            { etatId: 'mdp', date: '2020-01-02' },
            { etatId, date: '2020-01-02' }
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
      octEtatsValidate([
        { etatId: 'mcp', date: '2020-02-03' },
        { etatId: 'mdp', date: '2020-02-02' },
        { etatId: 'mfr', date: '2020-01-01' }
      ])
    ).toBeNull()
  })

  test('peut créer une "des" après "mdp"', () => {
    expect(
      octEtatsValidate([
        { etatId: 'mfr', date: '2020-01-01' },
        { etatId: 'mdp', date: '2020-01-01' },
        { etatId: 'des', date: '2020-01-04' }
      ])
    ).toBeNull()
  })

  test('ne peut pas créer deux "des"', () => {
    expect(
      octEtatsValidate([
        { etatId: 'mfr', date: '2020-01-01' },
        { etatId: 'mdp', date: '2020-01-01' },
        { etatId: 'des', date: '2020-01-04' },
        { etatId: 'des', date: '2020-01-04' }
      ])
    ).toEqual('L’étape "des" ne peut-être effecutée 2 fois d’affilée')
  })

  test('ne peut pas créer une "css" après une "des"', () => {
    expect(
      octEtatsValidate([
        { etatId: 'mfr', date: '2020-01-01' },
        { etatId: 'mdp', date: '2020-01-01' },
        { etatId: 'des', date: '2020-01-04' },
        { etatId: 'css', date: '2020-01-05' }
      ])
    ).toEqual('L’étape "css" n’est plus possible après "des"')
  })

  test('peut créer une "des" si le titre est en attente de "pfc"', () => {
    expect(
      octEtatsValidate(
        [
          { etatId: 'mfr', date: '2020-01-01' },
          { etatId: 'mdp', date: '2020-01-01' },
          { etatId: 'dae', statutId: 'fav', date: '2020-01-01' },
          { etatId: 'mcp', date: '2020-01-01', statutId: 'fav' },
          { etatId: 'vfd', date: '2020-01-01' },
          { etatId: 'mcr', date: '2020-01-01', statutId: 'fav' },
          { etatId: 'eof', date: '2020-01-01' },
          { etatId: 'aof', date: '2020-01-01' },
          { etatId: 'sca', date: '2020-01-02' },
          { etatId: 'aca', date: '2020-01-03', statutId: 'fav' },
          { etatId: 'mno-aca', date: '2020-01-04' },
          { etatId: 'des', date: '2020-01-04' }
        ],
        {
          contenu: { arm: { mecanise: true } }
        }
      )
    ).toBeNull()
  })

  test('ne peut pas créer une "mno" après la "aca" si le titre n’est pas mécanisé', () => {
    expect(
      octEtatsValidate([
        { etatId: 'mfr', date: '2020-01-01' },
        { etatId: 'mdp', date: '2020-01-01' },
        { etatId: 'mcp', date: '2020-01-01', statutId: 'fav' },
        { etatId: 'vfd', date: '2020-01-01' },
        { etatId: 'mcr', date: '2020-01-01', statutId: 'fav' },
        { etatId: 'eof', date: '2020-01-01' },
        { etatId: 'aof', date: '2020-01-01' },
        { etatId: 'sca', date: '2020-01-02' },
        { etatId: 'aca', date: '2020-01-03', statutId: 'fav' },
        { etatId: 'mno-aca', date: '2020-01-04' }
      ])
    ).toEqual('L’étape "mno-aca" n’est pas possible juste après "aca"')
  })

  test('peut créer une "mno-rej" apres une "aca" défavorable', () => {
    expect(
      octEtatsValidate([
        { etatId: 'mno-rej', date: '2020-08-18', statutId: 'fai' },
        { etatId: 'aca', date: '2020-08-18', statutId: 'def' },
        { etatId: 'sca', date: '2020-08-07', statutId: 'fai' },
        { etatId: 'aof', date: '2020-06-19', statutId: 'def' },
        { etatId: 'eof', date: '2020-06-19', statutId: 'fai' },
        { etatId: 'mcr', date: '2020-06-15', statutId: 'fav' },
        { etatId: 'vfd', date: '2020-06-15', statutId: 'fai' },
        { etatId: 'mcp', date: '2020-05-29', statutId: 'fav' },
        { etatId: 'mdp', date: '2020-05-04', statutId: 'fai' },
        { etatId: 'pfd', date: '2020-05-01', statutId: 'fai' },
        { etatId: 'mfr', date: '2020-04-29', statutId: 'fai' }
      ])
    ).toBeNull()
  })
  test('peut créer une "mod" si il n’y a pas de sca', () => {
    expect(
      octEtatsValidate([
        { etatId: 'mfr', date: '2019-12-12', statutId: 'fai' },
        { etatId: 'mdp', date: '2019-12-12', statutId: 'fai' },
        { etatId: 'pfd', date: '2019-12-12', statutId: 'fai' },
        { etatId: 'dae', date: '2020-01-14', statutId: 'fav' },
        { etatId: 'mcp', date: '2020-01-21', statutId: 'fav' },
        { etatId: 'vfd', date: '2020-02-05', statutId: 'fai' },
        { etatId: 'mcr', date: '2020-02-05', statutId: 'fav' },
        { etatId: 'eof', date: '2020-02-05', statutId: 'fai' },
        { etatId: 'aof', date: '2020-02-05', statutId: 'fav' },
        { etatId: 'rde', date: '2020-02-11', statutId: 'fav' },
        { etatId: 'mod', date: '2020-06-17', statutId: 'fai' }
      ])
    ).toBeNull()
  })

  test('peut créer une "mcp" après une "pfd" et "mdp"', () => {
    expect(
      octEtatsValidate([
        { etatId: 'mfr', date: '2020-01-30', statutId: 'fai' },
        { etatId: 'mdp', date: '2020-02-23', statutId: 'fai' },
        { etatId: 'pfd', date: '2020-02-23', statutId: 'fai' },
        { etatId: 'mcp', date: '2020-02-28', statutId: 'fav' }
      ])
    ).toBeNull()
  })

  test('peut créer une "sca" après une "aof" et "rde"', () => {
    expect(
      octEtatsValidate(
        [
          { etatId: 'dae', date: '2020-06-22', statutId: 'fav' },
          { etatId: 'mfr', date: '2020-07-09', statutId: 'fai' },
          { etatId: 'pfd', date: '2020-07-10', statutId: 'fai' },
          { etatId: 'mdp', date: '2020-07-17', statutId: 'fai' },
          { etatId: 'mcp', date: '2020-07-17', statutId: 'fav' },
          { etatId: 'rde', date: '2020-07-30', statutId: 'fav' },
          { etatId: 'vfd', date: '2020-07-31', statutId: 'fai' },
          { etatId: 'mcr', date: '2020-07-31', statutId: 'fav' },
          { etatId: 'eof', date: '2020-08-10', statutId: 'fai' },
          { etatId: 'aof', date: '2020-08-10', statutId: 'fav' },
          { etatId: 'sca', date: '2020-09-04', statutId: 'fai' }
        ],
        {
          contenu: { arm: { mecanise: true, franchissements: 3 } }
        }
      )
    ).toBeNull()
  })
})
