import { arbreTestGet } from '../_utils'

describe('vérifie l’arbre d’octroi d’ARM', () => {
  const octArbreTest = arbreTestGet('oct', 'arm')

  test('peut créer une rde si le titre a un franchissement d’eau', () => {
    expect(
      octArbreTest('rde', '', [], {
        contenu: {
          arm: {
            franchissements: 2
          }
        }
      })
    ).toBeNull()
  })

  test('ne peut pas créer une rde si le titre n’a pas de franchissement d’eau', () => {
    expect(
      octArbreTest('rde', '', [], {
        contenu: {
          arm: {
            franchissements: 0
          }
        }
      })
    ).toBeTruthy()
  })

  test('ne peut pas créer une sca si le titre a un franchissement d’eau et pas de rde', () => {
    expect(
      octArbreTest('sca', '', [{ typeId: 'aof', date: '2020-01-01' }], {
        contenu: {
          arm: {
            franchissements: 2
          }
        }
      })
    ).toBeTruthy()
  })

  test('ne peut pas créer une sca si le titre a un franchissement d’eau et une rde défavorable', () => {
    expect(
      octArbreTest(
        'sca',
        '',
        [
          { typeId: 'aof', date: '2020-01-01' },
          { typeId: 'rde', statutId: 'def', date: '2020-01-01' }
        ],
        {
          contenu: {
            arm: {
              franchissements: 2
            }
          }
        }
      )
    ).toBeTruthy()
  })

  test('peut créer une sca si le titre a un franchissement d’eau et une  rde favorable', () => {
    expect(
      octArbreTest(
        'sca',
        '',
        [
          { typeId: 'aof', date: '2020-01-01' },
          { typeId: 'rde', statutId: 'fav', date: '2020-01-01' }
        ],
        {
          contenu: {
            arm: {
              franchissements: 2
            }
          }
        }
      )
    ).toBeNull()
  })

  test('peut créer une sca si le titre n’a pas de franchissement d’eau et pas de rde', () => {
    expect(
      octArbreTest('sca', '', [{ typeId: 'aof', date: '2020-01-01' }], {
        contenu: {
          arm: {
            franchissements: 0
          }
        }
      })
    ).toBeNull()
  })

  test('peut créer une "des" si le titre est en attente de "pfc"', () => {
    expect(
      octArbreTest('des', '', [
        { typeId: 'mdp', date: '2020-01-01' },
        { typeId: 'sca', date: '2020-01-02' },
        { typeId: 'aca', date: '2020-01-03' },
        { typeId: 'mno', date: '2020-01-04' }
      ])
    ).toBeNull()
  })
})
