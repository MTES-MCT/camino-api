import { demarcheEtatsValidate } from '../_utils'

describe('vérifie l’arbre de retrait d’ARM', () => {
  const retEtatsValidate = demarcheEtatsValidate('ret', 'arm')

  test('peut créer une étape "ide" si il n’existe pas d’autres étapes', () => {
    expect(retEtatsValidate([{ etatId: 'ide' }])).toBeNull()
  })
  test('ne peut pas créer une étape "ide" si il y a déjà une "ide"', () => {
    expect(
      retEtatsValidate([
        { etatId: 'ide', date: '2020-01-01' },
        { etatId: 'ide' }
      ])
    ).toBeTruthy()
  })

  test('ne peut pas créer une étape "mno-ide" après une "eof"', () => {
    expect(
      retEtatsValidate([
        { etatId: 'ide', date: '2020-01-01' },
        { etatId: 'mno-ide', date: '2020-01-02' },
        { etatId: 'rif-mno', date: '2020-01-03' },
        { etatId: 'eof', date: '2020-01-04' },
        { etatId: 'mno-ide' }
      ])
    ).toContain('L’étape "mno-ide" n’est pas possible juste après "eof"')
  })

  test('ne peut pas créer une étape "mno-css" après la "mno-css"', () => {
    expect(
      retEtatsValidate([
        { etatId: 'ide' },
        { etatId: 'mno-ide' },
        { etatId: 'css' },
        { etatId: 'mno-css' },
        { etatId: 'mno-css' }
      ])
    ).toContain('L’étape "mno-css" ne peut-être effecutée 2 fois d’affilée')
  })

  test('peut créer une "aof" juste après une "mno"', () => {
    expect(
      retEtatsValidate([
        { etatId: 'ide' },
        { etatId: 'mno-ide' },
        { etatId: 'aof' }
      ])
    ).toBeNull()
  })

  test('ne peut pas créer une "aof" juste après une "rif-mno"', () => {
    expect(
      retEtatsValidate([
        { etatId: 'ide' },
        { etatId: 'mno-ide' },
        { etatId: 'rif-mno' },
        { etatId: 'aof' }
      ])
    ).toContain('L’étape "aof" n’est pas possible juste après "rif-mno"')
  })

  test('ne peut pas créer une "aof" après une "css"', () => {
    expect(
      retEtatsValidate([
        { etatId: 'ide' },
        { etatId: 'mno-ide' },
        { etatId: 'css' },
        { etatId: 'aof' }
      ])
    ).toContain('L’étape "aof" n’est pas possible juste après "css"')
  })

  test('ne peut pas créer une "css" juste après une "ide"', () => {
    expect(retEtatsValidate([{ etatId: 'ide' }, { etatId: 'css' }])).toContain(
      'L’étape "css" n’est pas possible après "ide"'
    )
  })

  test('peut créer une "mif-eof" juste après une "rif-mno"', () => {
    expect(
      retEtatsValidate([
        { etatId: 'ide' },
        { etatId: 'mno-ide' },
        { etatId: 'rif-mno' },
        { etatId: 'mif-eof' }
      ])
    ).toBeNull()
  })

  test('ne peut pas créer une "rif-mno" juste après une "mif-eof"', () => {
    expect(
      retEtatsValidate([
        { etatId: 'ide', date: '2020-01-01' },
        { etatId: 'mno-ide', date: '2020-01-02' },
        { etatId: 'rif-mno', date: '2020-01-03' },
        { etatId: 'mif-eof', date: '2020-01-04' },
        { etatId: 'rif-mno', date: '2020-01-05' }
      ])
    ).toContain('L’étape "rif-mno" n’est pas possible juste après "mif-eof"')
  })

  test('peut créer une "eof" juste après une "rif-eof"', () => {
    expect(
      retEtatsValidate([
        { etatId: 'ide', date: '2020-01-01' },
        { etatId: 'mno-ide', date: '2020-01-02' },
        { etatId: 'rif-mno', date: '2020-01-03' },
        { etatId: 'mif-eof', date: '2020-01-04' },
        { etatId: 'rif-eof', date: '2020-01-05' },
        { etatId: 'eof' }
      ])
    ).toBeNull()
  })

  test('ne peut pas créer une "eof" juste après une "mif-eof"', () => {
    expect(
      retEtatsValidate([
        { etatId: 'ide' },
        { etatId: 'mno-ide' },
        { etatId: 'rif-mno' },
        { etatId: 'mif-eof' },
        { etatId: 'eof' }
      ])
    ).toContain('L’étape "eof" n’est pas possible juste après "mif-eof"')
  })

  test('peut créer une "css" apres une "mno-ide"', () => {
    expect(
      retEtatsValidate([
        { etatId: 'ide' },
        { etatId: 'mno-ide' },
        { etatId: 'css' }
      ])
    ).toBeNull()
  })
  test('peut créer une "css" apres une "rif-mno"', () => {
    expect(
      retEtatsValidate([
        { etatId: 'ide' },
        { etatId: 'mno-ide' },
        { etatId: 'rif-mno' },
        { etatId: 'css' }
      ])
    ).toBeNull()
  })
  test('peut créer une "css" apres une "mif-eof"', () => {
    expect(
      retEtatsValidate([
        { etatId: 'ide' },
        { etatId: 'mno-ide' },
        { etatId: 'rif-mno' },
        { etatId: 'mif-eof' },
        { etatId: 'css' }
      ])
    ).toBeNull()
  })
  test('peut créer une "css" apres une "eof"', () => {
    expect(
      retEtatsValidate([
        { etatId: 'ide' },
        { etatId: 'mno-ide' },
        { etatId: 'rif-mno' },
        { etatId: 'eof' },
        { etatId: 'css' }
      ])
    ).toBeNull()
  })
  test('ne peut pas créer une "css" apres une "css"', () => {
    expect(
      retEtatsValidate([
        { etatId: 'ide', date: '2020-01-01' },
        { etatId: 'mno-ide', date: '2020-01-01' },
        { etatId: 'css', date: '2020-01-01' },
        { etatId: 'css' }
      ])
    ).toContain('L’étape "css" ne peut-être effecutée 2 fois d’affilée')
  })

  test('ne peut pas créer une "mno-ide" juste après une "css"', () => {
    expect(
      retEtatsValidate([
        { etatId: 'css', date: '2020-01-02' },
        { etatId: 'mno-ide', date: '2020-01-01' },
        { etatId: 'ide', date: '2020-01-01' },
        { etatId: 'mno-ide' }
      ])
    ).toContain('L’étape "mno-ide" n’est pas possible juste après ')
  })
})
