import { arbreTestGet } from '../_utils'

describe('vérifie l’arbre de retrait d’ARM', () => {
  const retArbreTest = arbreTestGet('ret', 'arm')

  test('peut créer une étape "ide" si il n’existe pas d’autres étapes', () => {
    expect(retArbreTest('ide', '', [])).toBeNull()
  })
  test('ne peut pas créer une étape "ide" si il y a déjà une "ide"', () => {
    expect(
      retArbreTest('ide', '', [{ typeId: 'ide', date: '2020-01-01' }])
    ).toBeTruthy()
  })

  test('ne peut pas créer une étape "mno" après une "eof"', () => {
    expect(
      retArbreTest('mno', '', [
        { typeId: 'ide', date: '2020-01-01' },
        { typeId: 'mno', date: '2020-01-01' },
        { typeId: 'rif', date: '2020-01-01' },
        { typeId: 'eof', date: '2020-01-01' }
      ])
    ).toBeTruthy()
  })

  // TODO on ne peut pas encore traiter ce cas, car il peut y avoir déjà une MNO dés le début de la démarche
  // test('ne peut pas créer une étape "mno" après la "mno" de classement sans suite', () => {
  //   expect(
  //     retArbreTest('mno', '', [
  //       { typeId: 'ide', date: '2020-01-01' },
  //       { typeId: 'mno', date: '2020-01-01' },
  //       { typeId: 'css', date: '2020-01-01' },
  //       { typeId: 'mno', date: '2020-01-01' }
  //     ] )
  //   ).toBeTruthy()
  // })

  test('peut créer une "aof" juste après une "mno"', () => {
    expect(
      retArbreTest('aof', '', [{ typeId: 'mno', date: '2020-01-01' }])
    ).toBeNull()
  })

  test('ne peut pas créer une "aof" juste après une "rif"', () => {
    expect(
      retArbreTest('aof', '', [
        { typeId: 'mno', date: '2020-01-01' },
        { typeId: 'rif', date: '2020-01-02' }
      ])
    ).toBeTruthy()
  })

  test('ne peut pas créer une "aof" après une "css"', () => {
    expect(
      retArbreTest('aof', '', [
        { typeId: 'eof', date: '2020-01-01' },
        { typeId: 'css', date: '2020-01-01' }
      ])
    ).toBeTruthy()
  })

  test('ne peut pas créer une "css" juste après une "ide"', () => {
    expect(
      retArbreTest('css', '', [{ typeId: 'ide', date: '2020-01-01' }])
    ).toBeTruthy()
  })

  // peut créer une "css" dés la "mno" jusqu’à la "aof"
  test.each(['mno', 'rif', 'mif', 'eof'])(
    'peut créer une "css" apres une "%s"',
    (etapeTypeId: string) => {
      expect(
        retArbreTest('css', '', [
          { typeId: 'mno', date: '2020-01-01' },
          { typeId: etapeTypeId, date: '2020-01-01' }
        ])
      ).toBeNull()
    }
  )
  test.each(['aof', 'css'])(
    'ne peut pas créer une "css" apres une "%s"',
    (etapeTypeId: string) => {
      expect(
        retArbreTest('css', '', [
          { typeId: 'mno', date: '2020-01-01' },
          { typeId: etapeTypeId, date: '2020-01-01' }
        ])
      ).toBeTruthy()
    }
  )
})
