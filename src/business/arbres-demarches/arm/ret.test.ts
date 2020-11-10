import { arbreErreursGet } from '../_utils'

describe('vérifie l’arbre de retrait d’ARM', () => {
  const retArbreErreursGet = arbreErreursGet('ret', 'arm')

  test('peut créer une étape "ide" si il n’existe pas d’autres étapes', () => {
    expect(retArbreErreursGet('ide', [])).toBeNull()
  })
  test('ne peut pas créer une étape "ide" si il y a déjà une "ide"', () => {
    expect(
      retArbreErreursGet('ide', [{ arbreTypeId: 'ide', date: '2020-01-01' }])
    ).toBeTruthy()
  })

  test('ne peut pas créer une étape "mno-ide" après une "eof"', () => {
    expect(
      retArbreErreursGet('mno-ide', [
        { arbreTypeId: 'ide', date: '2020-01-01' },
        { arbreTypeId: 'mno-ide', date: '2020-01-02' },
        { arbreTypeId: 'rif-mno', date: '2020-01-03' },
        { arbreTypeId: 'eof', date: '2020-01-04' }
      ])
    ).toContain('L’étape "mno-ide" n’est pas possible juste après "eof"')
  })

  test('ne peut pas créer une étape "mno-css" après la "mno-css"', () => {
    expect(
      retArbreErreursGet('mno-css', [
        { arbreTypeId: 'ide' },
        { arbreTypeId: 'mno-ide' },
        { arbreTypeId: 'css' },
        { arbreTypeId: 'mno-css' }
      ])
    ).toContain('L’étape "mno-css" n’est pas possible juste après "mno-css"')
  })

  test('peut créer une "aof" juste après une "mno"', () => {
    expect(
      retArbreErreursGet('aof', [
        { arbreTypeId: 'ide' },
        { arbreTypeId: 'mno-ide' }
      ])
    ).toBeNull()
  })

  test('ne peut pas créer une "aof" juste après une "rif-mno"', () => {
    expect(
      retArbreErreursGet('aof', [
        { arbreTypeId: 'ide' },
        { arbreTypeId: 'mno-ide' },
        { arbreTypeId: 'rif-mno' }
      ])
    ).toContain('L’étape "aof" n’est pas possible juste après "rif-mno"')
  })

  test('ne peut pas créer une "aof" après une "css"', () => {
    expect(
      retArbreErreursGet('aof', [
        { arbreTypeId: 'ide' },
        { arbreTypeId: 'mno-ide' },
        { arbreTypeId: 'css' }
      ])
    ).toContain('L’étape "aof" n’est pas possible juste après "css"')
  })

  test('ne peut pas créer une "css" juste après une "ide"', () => {
    expect(retArbreErreursGet('css', [{ arbreTypeId: 'ide' }])).toContain(
      'L’étape "css" n’est pas possible après "ide"'
    )
  })

  test('peut créer une "mif-eof" juste après une "rif-mno"', () => {
    expect(
      retArbreErreursGet('mif-eof', [
        { arbreTypeId: 'ide' },
        { arbreTypeId: 'mno-ide' },
        { arbreTypeId: 'rif-mno' }
      ])
    ).toBeNull()
  })

  test('ne peut pas créer une "rif-mno" juste après une "mif-eof"', () => {
    expect(
      retArbreErreursGet('rif-mno', [
        { arbreTypeId: 'ide', date: '2020-01-01' },
        { arbreTypeId: 'mno-ide', date: '2020-01-02' },
        { arbreTypeId: 'rif-mno', date: '2020-01-03' },
        { arbreTypeId: 'mif-eof', date: '2020-01-04' }
      ])
    ).toContain('L’étape "rif-mno" n’est pas possible juste après "mif-eof"')
  })

  test('peut créer une "eof" juste après une "rif-eof"', () => {
    expect(
      retArbreErreursGet('eof', [
        { arbreTypeId: 'ide', date: '2020-01-01' },
        { arbreTypeId: 'mno-ide', date: '2020-01-02' },
        { arbreTypeId: 'rif-mno', date: '2020-01-03' },
        { arbreTypeId: 'mif-eof', date: '2020-01-04' },
        { arbreTypeId: 'rif-eof', date: '2020-01-05' }
      ])
    ).toBeNull()
  })

  test('ne peut pas créer une "eof" juste après une "mif-eof"', () => {
    expect(
      retArbreErreursGet('eof', [
        { arbreTypeId: 'ide' },
        { arbreTypeId: 'mno-ide' },
        { arbreTypeId: 'rif-mno' },
        { arbreTypeId: 'mif-eof' }
      ])
    ).toContain('L’étape "eof" n’est pas possible juste après "mif-eof"')
  })

  test('peut créer une "css" apres une "mno-ide"', () => {
    expect(
      retArbreErreursGet('css', [
        { arbreTypeId: 'ide' },
        { arbreTypeId: 'mno-ide' }
      ])
    ).toBeNull()
  })
  test('peut créer une "css" apres une "rif-mno"', () => {
    expect(
      retArbreErreursGet('css', [
        { arbreTypeId: 'ide' },
        { arbreTypeId: 'mno-ide' },
        { arbreTypeId: 'rif-mno' }
      ])
    ).toBeNull()
  })
  test('peut créer une "css" apres une "mif-eof"', () => {
    expect(
      retArbreErreursGet('css', [
        { arbreTypeId: 'ide' },
        { arbreTypeId: 'mno-ide' },
        { arbreTypeId: 'rif-mno' },
        { arbreTypeId: 'mif-eof' }
      ])
    ).toBeNull()
  })
  test('peut créer une "css" apres une "eof"', () => {
    expect(
      retArbreErreursGet('css', [
        { arbreTypeId: 'ide' },
        { arbreTypeId: 'mno-ide' },
        { arbreTypeId: 'rif-mno' },
        { arbreTypeId: 'eof' }
      ])
    ).toBeNull()
  })
  test('ne peut pas créer une "css" apres une "css"', () => {
    expect(
      retArbreErreursGet('css', [
        { arbreTypeId: 'ide', date: '2020-01-01' },
        { arbreTypeId: 'mno-ide', date: '2020-01-01' },
        { arbreTypeId: 'css', date: '2020-01-01' }
      ])
    ).toContain('L’étape "css" existe déjà')
  })

  test('ne peut pas créer une "mno-ide" juste après une "css"', () => {
    expect(
      retArbreErreursGet('mno-ide', [
        { arbreTypeId: 'css', date: '2020-01-02' },
        { arbreTypeId: 'mno-ide', date: '2020-01-01' },
        { arbreTypeId: 'ide', date: '2020-01-01' }
      ])
    ).toContain('L’étape "mno-ide" n’est pas possible juste après ')
  })
})
