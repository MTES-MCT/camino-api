import { arbreErreursGet } from '../_utils'

describe('vérifie l’arbre de retrait d’ARM', () => {
  const retArbreErreursGet = arbreErreursGet('ret', 'arm')

  test('peut créer une étape "ide" si il n’existe pas d’autres étapes', () => {
    expect(retArbreErreursGet([{ arbreTypeId: 'ide' }])).toBeNull()
  })
  test('ne peut pas créer une étape "ide" si il y a déjà une "ide"', () => {
    expect(
      retArbreErreursGet([
        { arbreTypeId: 'ide', date: '2020-01-01' },
        { arbreTypeId: 'ide' }
      ])
    ).toBeTruthy()
  })

  test('ne peut pas créer une étape "mno-ide" après une "eof"', () => {
    expect(
      retArbreErreursGet([
        { arbreTypeId: 'ide', date: '2020-01-01' },
        { arbreTypeId: 'mno-ide', date: '2020-01-02' },
        { arbreTypeId: 'rif-mno', date: '2020-01-03' },
        { arbreTypeId: 'eof', date: '2020-01-04' },
        { arbreTypeId: 'mno-ide' }
      ])
    ).toContain('L’étape "mno-ide" n’est pas possible juste après "eof"')
  })

  test('ne peut pas créer une étape "mno-css" après la "mno-css"', () => {
    expect(
      retArbreErreursGet([
        { arbreTypeId: 'ide' },
        { arbreTypeId: 'mno-ide' },
        { arbreTypeId: 'css' },
        { arbreTypeId: 'mno-css' },
        { arbreTypeId: 'mno-css' }
      ])
    ).toContain('L’étape "mno-css" n’est pas possible juste après "mno-css"')
  })

  test('peut créer une "aof" juste après une "mno"', () => {
    expect(
      retArbreErreursGet([
        { arbreTypeId: 'ide' },
        { arbreTypeId: 'mno-ide' },
        { arbreTypeId: 'aof' }
      ])
    ).toBeNull()
  })

  test('ne peut pas créer une "aof" juste après une "rif-mno"', () => {
    expect(
      retArbreErreursGet([
        { arbreTypeId: 'ide' },
        { arbreTypeId: 'mno-ide' },
        { arbreTypeId: 'rif-mno' },
        { arbreTypeId: 'aof' }
      ])
    ).toContain('L’étape "aof" n’est pas possible juste après "rif-mno"')
  })

  test('ne peut pas créer une "aof" après une "css"', () => {
    expect(
      retArbreErreursGet([
        { arbreTypeId: 'ide' },
        { arbreTypeId: 'mno-ide' },
        { arbreTypeId: 'css' },
        { arbreTypeId: 'aof' }
      ])
    ).toContain('L’étape "aof" n’est pas possible juste après "css"')
  })

  test('ne peut pas créer une "css" juste après une "ide"', () => {
    expect(
      retArbreErreursGet([{ arbreTypeId: 'ide' }, { arbreTypeId: 'css' }])
    ).toContain('L’étape "css" n’est pas possible après "ide"')
  })

  test('peut créer une "mif-eof" juste après une "rif-mno"', () => {
    expect(
      retArbreErreursGet([
        { arbreTypeId: 'ide' },
        { arbreTypeId: 'mno-ide' },
        { arbreTypeId: 'rif-mno' },
        { arbreTypeId: 'mif-eof' }
      ])
    ).toBeNull()
  })

  test('ne peut pas créer une "rif-mno" juste après une "mif-eof"', () => {
    expect(
      retArbreErreursGet([
        { arbreTypeId: 'ide', date: '2020-01-01' },
        { arbreTypeId: 'mno-ide', date: '2020-01-02' },
        { arbreTypeId: 'rif-mno', date: '2020-01-03' },
        { arbreTypeId: 'mif-eof', date: '2020-01-04' },
        { arbreTypeId: 'rif-mno', date: '2020-01-05' }
      ])
    ).toContain('L’étape "rif-mno" n’est pas possible juste après "mif-eof"')
  })

  test('peut créer une "eof" juste après une "rif-eof"', () => {
    expect(
      retArbreErreursGet([
        { arbreTypeId: 'ide', date: '2020-01-01' },
        { arbreTypeId: 'mno-ide', date: '2020-01-02' },
        { arbreTypeId: 'rif-mno', date: '2020-01-03' },
        { arbreTypeId: 'mif-eof', date: '2020-01-04' },
        { arbreTypeId: 'rif-eof', date: '2020-01-05' },
        { arbreTypeId: 'eof' }
      ])
    ).toBeNull()
  })

  test('ne peut pas créer une "eof" juste après une "mif-eof"', () => {
    expect(
      retArbreErreursGet([
        { arbreTypeId: 'ide' },
        { arbreTypeId: 'mno-ide' },
        { arbreTypeId: 'rif-mno' },
        { arbreTypeId: 'mif-eof' },
        { arbreTypeId: 'eof' }
      ])
    ).toContain('L’étape "eof" n’est pas possible juste après "mif-eof"')
  })

  test('peut créer une "css" apres une "mno-ide"', () => {
    expect(
      retArbreErreursGet([
        { arbreTypeId: 'ide' },
        { arbreTypeId: 'mno-ide' },
        { arbreTypeId: 'css' }
      ])
    ).toBeNull()
  })
  test('peut créer une "css" apres une "rif-mno"', () => {
    expect(
      retArbreErreursGet([
        { arbreTypeId: 'ide' },
        { arbreTypeId: 'mno-ide' },
        { arbreTypeId: 'rif-mno' },
        { arbreTypeId: 'css' }
      ])
    ).toBeNull()
  })
  test('peut créer une "css" apres une "mif-eof"', () => {
    expect(
      retArbreErreursGet([
        { arbreTypeId: 'ide' },
        { arbreTypeId: 'mno-ide' },
        { arbreTypeId: 'rif-mno' },
        { arbreTypeId: 'mif-eof' },
        { arbreTypeId: 'css' }
      ])
    ).toBeNull()
  })
  test('peut créer une "css" apres une "eof"', () => {
    expect(
      retArbreErreursGet([
        { arbreTypeId: 'ide' },
        { arbreTypeId: 'mno-ide' },
        { arbreTypeId: 'rif-mno' },
        { arbreTypeId: 'eof' },
        { arbreTypeId: 'css' }
      ])
    ).toBeNull()
  })
  test('ne peut pas créer une "css" apres une "css"', () => {
    expect(
      retArbreErreursGet([
        { arbreTypeId: 'ide', date: '2020-01-01' },
        { arbreTypeId: 'mno-ide', date: '2020-01-01' },
        { arbreTypeId: 'css', date: '2020-01-01' },
        { arbreTypeId: 'css' }
      ])
    ).toContain('L’étape "css" existe déjà')
  })

  test('ne peut pas créer une "mno-ide" juste après une "css"', () => {
    expect(
      retArbreErreursGet([
        { arbreTypeId: 'css', date: '2020-01-02' },
        { arbreTypeId: 'mno-ide', date: '2020-01-01' },
        { arbreTypeId: 'ide', date: '2020-01-01' },
        { arbreTypeId: 'mno-ide' }
      ])
    ).toContain('L’étape "mno-ide" n’est pas possible juste après ')
  })
})
