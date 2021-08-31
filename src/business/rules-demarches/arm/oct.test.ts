import { demarcheEtatsValidate } from '../_utils.test'

describe('vérifie l’arbre d’octroi d’ARM', () => {
  const octEtatsValidate = demarcheEtatsValidate('oct', 'arm')

  test.each(['mfr', 'pfd', 'dae', 'rde'])(
    'peut créer une étape "%s" si il n’existe pas d’autres étapes',
    typeId => {
      expect(octEtatsValidate([{ typeId }])).toHaveLength(0)
    }
  )

  test.each(['mcd', 'mcb'])(
    'ne peut pas créer une étape "%s" si il n’existe pas d’autres étapes',
    typeId => {
      expect(octEtatsValidate([{ typeId }])).toEqual([
        `l’étape "${typeId}" n’est pas possible après `
      ])
    }
  )

  test('peut créer une étape "mdp" juste après une "mfr"', () => {
    expect(
      octEtatsValidate([{ typeId: 'mfr', statutId: 'fai' }, { typeId: 'mdp' }])
    ).toHaveLength(0)
  })

  test('ne peut pas créer une étape "mdp" juste après une "mfr" en construction', () => {
    expect(
      octEtatsValidate([{ typeId: 'mfr', statutId: 'aco' }, { typeId: 'mdp' }])
    ).toEqual(['l’étape "mdp" n’est pas possible juste après "mfr"'])
  })

  test('ne peut pas créer une étape "mcp" sans "mdp"', () => {
    expect(
      octEtatsValidate([
        { typeId: 'mfr', statutId: 'fai' },
        { typeId: 'pfd' },
        { typeId: 'mcp' }
      ])
    ).toEqual(['l’étape "mcp" n’est pas possible juste après "mfr", "pfd"'])
  })

  test('ne peut pas créer 2 "mfr"', () => {
    expect(
      octEtatsValidate([
        { typeId: 'mfr', statutId: 'fai', date: '2020-01-01' },
        { typeId: 'mdp', date: '2020-01-02' },
        { typeId: 'mfr', date: '2020-01-03' }
      ])
    ).toEqual(['l’étape "mfr" existe déjà'])
  })

  test('ne peut pas créer une étape "mfr" si il y a déjà une "mfr"', () => {
    expect(
      octEtatsValidate([
        { typeId: 'mfr', date: '2020-01-03', statutId: 'fai' },
        { typeId: 'mdp', date: '2020-01-02' },
        { typeId: 'mfr', date: '2020-01-01', statutId: 'fai' }
      ])
    ).toEqual(['l’étape "mfr" existe déjà'])
  })

  test('ne peut pas déplacer une étape "mfr" après une "mdp"', () => {
    expect(
      octEtatsValidate([
        { typeId: 'mdp', date: '2020-02-02' },
        { typeId: 'mfr', statutId: 'fai', date: '2020-02-03' }
      ])
    ).toEqual(['l’étape "mdp" n’est pas possible juste après '])
  })

  test.each(['rde', 'dae'])(
    'peut créer une étape "%s" juste après une "mdp" et que le titre est mécanisé avec franchissement d’eau',
    typeId => {
      expect(
        octEtatsValidate(
          [
            { typeId: 'mfr', statutId: 'fai', date: '2020-01-01' },
            { typeId: 'mdp', date: '2020-01-02' },
            { typeId, date: '2020-01-02' }
          ],
          {
            contenu: { arm: { mecanise: true, franchissements: 1 } }
          }
        )
      ).toHaveLength(0)
    }
  )

  test('peut créer une étape "mcp" après une "mdp"', () => {
    expect(
      octEtatsValidate([
        { typeId: 'mcp', date: '2020-02-03' },
        { typeId: 'mdp', date: '2020-02-02' },
        { typeId: 'mfr', statutId: 'fai', date: '2020-01-01' }
      ])
    ).toHaveLength(0)
  })

  test('peut créer une "des" après "mdp"', () => {
    expect(
      octEtatsValidate([
        { typeId: 'mfr', statutId: 'fai', date: '2020-01-01' },
        { typeId: 'mdp', date: '2020-01-01' },
        { typeId: 'des', date: '2020-01-04' }
      ])
    ).toHaveLength(0)
  })

  test('ne peut pas créer deux "des"', () => {
    expect(
      octEtatsValidate([
        { typeId: 'mfr', statutId: 'fai', date: '2020-01-01' },
        { typeId: 'mdp', date: '2020-01-01' },
        { typeId: 'des', date: '2020-01-04' },
        { typeId: 'des', date: '2020-01-04' }
      ])
    ).toEqual(['l’étape "des" ne peut-être effecutée 2 fois d’affilée'])
  })

  test('ne peut pas créer une "css" après une "des"', () => {
    expect(
      octEtatsValidate([
        { typeId: 'mfr', statutId: 'fai', date: '2020-01-01' },
        { typeId: 'mdp', date: '2020-01-01' },
        { typeId: 'des', date: '2020-01-04' },
        { typeId: 'css', date: '2020-01-05' }
      ])
    ).toEqual(['l’étape "css" n’est plus possible après "des"'])
  })

  test('peut créer une "des" si le titre est en attente de "pfc"', () => {
    expect(
      octEtatsValidate(
        [
          { typeId: 'mfr', statutId: 'fai', date: '2020-01-01' },
          { typeId: 'mdp', date: '2020-01-01' },
          { typeId: 'dae', statutId: 'exe', date: '2020-01-01' },
          { typeId: 'mcp', date: '2020-01-01', statutId: 'fav' },
          { typeId: 'mod', date: '2020-01-01' },
          { typeId: 'vfd', date: '2020-01-01' },
          { typeId: 'mcr', date: '2020-01-01', statutId: 'fav' },
          { typeId: 'eof', date: '2020-01-01' },
          { typeId: 'aof', date: '2020-01-01' },
          { typeId: 'sca', date: '2020-01-02' },
          { typeId: 'aca', date: '2020-01-03', statutId: 'fav' },
          { typeId: 'mnb', date: '2020-01-04' },
          { typeId: 'des', date: '2020-01-04' }
        ],
        {
          contenu: { arm: { mecanise: true } }
        }
      )
    ).toHaveLength(0)
  })

  test('ne peut pas créer une "mno" après la "aca" si le titre n’est pas mécanisé', () => {
    expect(
      octEtatsValidate([
        { typeId: 'mfr', statutId: 'fai', date: '2020-01-01' },
        { typeId: 'mdp', date: '2020-01-01' },
        { typeId: 'mcp', date: '2020-01-01', statutId: 'fav' },
        { typeId: 'vfd', date: '2020-01-01' },
        { typeId: 'mcr', date: '2020-01-01', statutId: 'fav' },
        { typeId: 'eof', date: '2020-01-01' },
        { typeId: 'aof', date: '2020-01-01' },
        { typeId: 'sca', date: '2020-01-02' },
        { typeId: 'aca', date: '2020-01-03', statutId: 'fav' },
        { typeId: 'mnb', date: '2020-01-04' }
      ])
    ).toEqual(['l’étape "mnb" n’est pas possible juste après "aca"'])
  })

  test('peut créer une "mnd" apres une "aca" défavorable', () => {
    expect(
      octEtatsValidate([
        { typeId: 'mnd', date: '2020-08-18', statutId: 'fai' },
        { typeId: 'aca', date: '2020-08-18', statutId: 'def' },
        { typeId: 'sca', date: '2020-08-07', statutId: 'fai' },
        { typeId: 'aof', date: '2020-06-19', statutId: 'def' },
        { typeId: 'eof', date: '2020-06-19', statutId: 'fai' },
        { typeId: 'mcr', date: '2020-06-15', statutId: 'fav' },
        { typeId: 'vfd', date: '2020-06-15', statutId: 'fai' },
        { typeId: 'mcp', date: '2020-05-29', statutId: 'fav' },
        { typeId: 'mdp', date: '2020-05-04', statutId: 'fai' },
        { typeId: 'pfd', date: '2020-05-01', statutId: 'fai' },
        { typeId: 'mfr', date: '2020-04-29', statutId: 'fai' }
      ])
    ).toHaveLength(0)
  })
  test('peut créer une "mod" si il n’y a pas de sca', () => {
    expect(
      octEtatsValidate([
        { typeId: 'mfr', date: '2019-12-12', statutId: 'fai' },
        { typeId: 'mdp', date: '2019-12-12', statutId: 'fai' },
        { typeId: 'pfd', date: '2019-12-12', statutId: 'fai' },
        { typeId: 'dae', date: '2020-01-14', statutId: 'fav' },
        { typeId: 'mcp', date: '2020-01-21', statutId: 'fav' },
        { typeId: 'vfd', date: '2020-02-05', statutId: 'fai' },
        { typeId: 'mcr', date: '2020-02-05', statutId: 'fav' },
        { typeId: 'eof', date: '2020-02-05', statutId: 'fai' },
        { typeId: 'aof', date: '2020-02-05', statutId: 'fav' },
        { typeId: 'rde', date: '2020-02-11', statutId: 'fav' },
        { typeId: 'mod', date: '2020-06-17', statutId: 'fai' }
      ])
    ).toHaveLength(0)
  })

  test('peut créer une "mcp" après une "pfd" et "mdp"', () => {
    expect(
      octEtatsValidate([
        { typeId: 'mfr', date: '2020-01-30', statutId: 'fai' },
        { typeId: 'mdp', date: '2020-02-23', statutId: 'fai' },
        { typeId: 'pfd', date: '2020-02-23', statutId: 'fai' },
        { typeId: 'mcp', date: '2020-02-28', statutId: 'fav' }
      ])
    ).toHaveLength(0)
  })

  test('peut créer une "sca" après une "aof" et "rde"', () => {
    expect(
      octEtatsValidate(
        [
          { typeId: 'dae', date: '2020-06-22', statutId: 'exe' },
          { typeId: 'mfr', date: '2020-07-09', statutId: 'fai' },
          { typeId: 'pfd', date: '2020-07-10', statutId: 'fai' },
          { typeId: 'mdp', date: '2020-07-17', statutId: 'fai' },
          { typeId: 'mcp', date: '2020-07-17', statutId: 'fav' },
          { typeId: 'rde', date: '2020-07-30', statutId: 'fav' },
          { typeId: 'vfd', date: '2020-07-31', statutId: 'fai' },
          { typeId: 'mcr', date: '2020-07-31', statutId: 'fav' },
          { typeId: 'eof', date: '2020-08-10', statutId: 'fai' },
          { typeId: 'aof', date: '2020-08-10', statutId: 'fav' },
          { typeId: 'sca', date: '2020-09-04', statutId: 'fai' }
        ],
        {
          contenu: { arm: { mecanise: true, franchissements: 3 } }
        }
      )
    ).toHaveLength(0)
  })

  test('peut créer une "mnb" après une "aca" favorable', () => {
    expect(
      octEtatsValidate(
        [
          { typeId: 'sco', statutId: 'fai', date: '2020-09-28' },
          { typeId: 'vfc', statutId: 'fai', date: '2020-07-16' },
          { typeId: 'pfc', statutId: 'fai', date: '2020-07-16' },
          { typeId: 'mnb', statutId: 'fai', date: '2020-07-09' },
          { typeId: 'aca', statutId: 'fav', date: '2020-06-17' },
          { typeId: 'sca', statutId: 'fai', date: '2020-06-15' },
          { typeId: 'rde', statutId: 'fav', date: '2020-02-11' },
          { typeId: 'aof', statutId: 'fav', date: '2020-02-05' },
          { typeId: 'eof', statutId: 'fai', date: '2020-02-05' },
          { typeId: 'mcr', statutId: 'fav', date: '2020-02-05' },
          { typeId: 'vfd', statutId: 'fai', date: '2020-02-05' },
          { typeId: 'mcp', statutId: 'fav', date: '2020-01-23' },
          { typeId: 'dae', statutId: 'exe', date: '2020-01-14' },
          { typeId: 'pfd', statutId: 'fai', date: '2019-12-12' },
          { typeId: 'mdp', statutId: 'fai', date: '2019-12-12' },
          { typeId: 'mfr', statutId: 'fai', date: '2019-12-12' }
        ],
        {
          contenu: { arm: { mecanise: true, franchissements: 3 } }
        }
      )
    ).toHaveLength(0)
  })

  test('les étapes sont vérifiées dans le bon ordre', () => {
    expect(
      octEtatsValidate(
        [
          { typeId: 'aof', statutId: 'fav', date: '2021-06-08' },
          { typeId: 'eof', statutId: 'fai', date: '2021-06-02' },
          { typeId: 'mcp', statutId: 'fav', date: '2021-05-20' },
          { typeId: 'mcr', statutId: 'fav', date: '2021-05-20' },
          { typeId: 'vfd', statutId: 'fai', date: '2021-05-20' },
          { typeId: 'pfd', statutId: 'fai', date: '2021-05-20' },
          { typeId: 'dae', statutId: 'exe', date: '2021-05-20' },
          { typeId: 'mdp', statutId: 'fai', date: '2021-05-20' },
          { typeId: 'mfr', statutId: 'fai', date: '2021-05-20' },
          { typeId: 'rde', statutId: 'fav', date: '2021-04-09' }
        ],
        {
          contenu: { arm: { mecanise: true, franchissements: 3 } }
        }
      )
    ).toHaveLength(0)
  })
})
