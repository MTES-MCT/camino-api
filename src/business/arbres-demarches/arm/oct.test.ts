import { arbreErreursGet } from '../_utils'

describe('vérifie l’arbre d’octroi d’ARM', () => {
  const octArbreErreursGet = arbreErreursGet('oct', 'arm')

  test.each(['mfr'])(
    'peut créer une étape "%s" si il n’existe pas d’autres étapes',
    arbreTypeId => {
      expect(octArbreErreursGet(arbreTypeId, [])).toBeNull()
    }
  )

  test('peut créer une étape "mdp" juste après une "mfr"', () => {
    expect(octArbreErreursGet('mdp', [{ arbreTypeId: 'mfr' }])).toBeNull()
  })

  test('ne peut pas créer une étape "mfr" si il y a déjà une "mfr"', () => {
    expect(
      octArbreErreursGet('mfr', [
        { arbreTypeId: 'mfr' },
        { arbreTypeId: 'mdp' }
      ])
    ).toBeTruthy()
  })

  test('peut déplacer une étape "mfr" avant une "mdp"', () => {
    expect(
      octArbreErreursGet(
        'mfr',

        [
          { arbreTypeId: 'mdp', date: '2020-02-02' },
          { arbreTypeId: 'mfr', date: '2020-01-01', id: 'mfr-1' }
        ],
        {},
        { date: '2020-02-01', id: 'mfr-1' }
      )
    ).toBeNull()
  })

  test('ne peut pas déplacer une étape "mfr" après une "mdp"', () => {
    expect(
      octArbreErreursGet(
        'mfr',

        [
          { arbreTypeId: 'mdp', date: '2020-02-02' },
          { arbreTypeId: 'mfr', date: '2020-01-01', id: 'mfr-1' }
        ],
        {},
        { date: '2020-03-01', id: 'mfr-1' }
      )
    ).toBeTruthy()
  })

  test.each(['rde', 'dae', 'pfd'])(
    'ne peut pas créer une étape "%s" si il n’existe pas d’autres étapes et que le titre n’est pas mécanisé',
    arbreTypeId => {
      expect(
        octArbreErreursGet(arbreTypeId, [], {
          contenu: { arm: { mecanise: false } }
        })
      ).toBeTruthy()
    }
  )

  test.each(['rde', 'dae'])(
    'ne peut pas créer une étape "%s" si il n’existe pas d’autres étapes et que le titre est mécanisé avec franchissement d’eau',
    arbreTypeId => {
      expect(
        octArbreErreursGet(arbreTypeId, [], {
          contenu: { arm: { mecanise: true, franchissements: 1 } }
        })
      ).toBeTruthy()
    }
  )

  test.each(['rde', 'dae'])(
    'peut créer une étape "%s" juste après une "mdp" et que le titre est mécanisé avec franchissement d’eau',
    arbreTypeId => {
      expect(
        octArbreErreursGet(
          arbreTypeId,

          [
            { arbreTypeId: 'mfr', date: '2020-01-01' },
            { arbreTypeId: 'mdp', date: '2020-01-02' }
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
      octArbreErreursGet(
        'mcp',

        [
          { arbreTypeId: 'mdp', date: '2020-02-02' },
          { arbreTypeId: 'mfr', date: '2020-01-01' }
        ],
        {
          contenu: { arm: { mecanise: false } }
        }
      )
    ).toBeNull()
  })

  test('peut créer une "des" si le titre est en attente de "pfc"', () => {
    expect(
      octArbreErreursGet(
        'des',

        [
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
        ],
        {
          contenu: { arm: { mecanise: false } }
        }
      )
    ).toBeNull()
  })
})
