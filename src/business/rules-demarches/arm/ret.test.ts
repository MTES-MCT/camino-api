import { demarcheEtatsValidate } from '../_utils.test'

describe('vérifie l’arbre de retrait d’ARM', () => {
  const retEtatsValidate = demarcheEtatsValidate('ret', 'arm')

  test('peut créer une étape "ide" si il n’existe pas d’autres étapes', () => {
    expect(retEtatsValidate([{ typeId: 'ide' }])).toHaveLength(0)
  })
  test('ne peut pas créer une étape "ide" si il y a déjà une "ide"', () => {
    expect(
      retEtatsValidate([
        { typeId: 'ide', date: '2020-01-01' },
        { typeId: 'ide' }
      ])
    ).toEqual(['l’étape "ide" ne peut-être effecutée 2 fois d’affilée'])
  })

  test('ne peut pas faire 2 ide', () => {
    expect(
      retEtatsValidate([
        { typeId: 'ide', date: '2020-05-27' },
        { typeId: 'mni', date: '2020-06-03' },
        { typeId: 'ide', date: '2020-07-07' }
      ])
    ).toEqual(['l’étape "ide" existe déjà'])
  })

  test('ne peut pas créer une étape "mni" après une "eof"', () => {
    expect(
      retEtatsValidate([
        { typeId: 'ide', date: '2020-01-01' },
        { typeId: 'mni', date: '2020-01-02' },
        { typeId: 'rif', date: '2020-01-03' },
        { typeId: 'eof', date: '2020-01-04' },
        { typeId: 'mni', date: '2020-01-05' }
      ])
    ).toEqual(['l’étape "mni" n’est pas possible juste après "eof"'])
  })

  test('ne peut pas créer une étape "mnc" après la "mnc"', () => {
    expect(
      retEtatsValidate([
        { typeId: 'ide' },
        { typeId: 'mni' },
        { typeId: 'css' },
        { typeId: 'mnc' },
        { typeId: 'mnc' }
      ])
    ).toEqual(['l’étape "mnc" ne peut-être effecutée 2 fois d’affilée'])
  })

  test('peut créer une "aof" juste après une "mno"', () => {
    expect(
      retEtatsValidate([
        { typeId: 'ide' },
        { typeId: 'mni' },
        { typeId: 'aof' }
      ])
    ).toHaveLength(0)
  })

  test('ne peut pas créer une "aof" juste après une "rif"', () => {
    expect(
      retEtatsValidate([
        { typeId: 'ide' },
        { typeId: 'mni' },
        { typeId: 'rif' },
        { typeId: 'aof' }
      ])
    ).toEqual(['l’étape "aof" n’est pas possible juste après "rif"'])
  })

  test('ne peut pas créer une "aof" après une "css"', () => {
    expect(
      retEtatsValidate([
        { typeId: 'ide', date: '2020-01-01' },
        { typeId: 'mni', date: '2020-01-02' },
        { typeId: 'css', date: '2020-01-03' },
        { typeId: 'aof', date: '2020-01-04' }
      ])
    ).toEqual(['l’étape "aof" n’est pas possible juste après "css"'])
  })

  test('ne peut pas créer une "css" juste après une "ide"', () => {
    expect(retEtatsValidate([{ typeId: 'ide' }, { typeId: 'css' }])).toEqual([
      'l’étape "css" n’est pas possible après "ide"'
    ])
  })

  test('peut créer une "mio" juste après une "rif"', () => {
    expect(
      retEtatsValidate([
        { typeId: 'ide', date: '2020-01-01' },
        { typeId: 'mni', date: '2020-01-02' },
        { typeId: 'rif', date: '2020-01-03' },
        { typeId: 'mio', date: '2020-01-04' }
      ])
    ).toHaveLength(0)
  })

  test('ne peut pas créer une "rif" juste après une "mio"', () => {
    expect(
      retEtatsValidate([
        { typeId: 'ide', date: '2020-01-01' },
        { typeId: 'mni', date: '2020-01-02' },
        { typeId: 'rif', date: '2020-01-03' },
        { typeId: 'mio', date: '2020-01-04' },
        { typeId: 'rif', date: '2020-01-05' }
      ])
    ).toEqual(['l’étape "rif" n’est pas possible juste après "mio"'])
  })

  test('peut créer une "eof" juste après une "rio"', () => {
    expect(
      retEtatsValidate([
        { typeId: 'ide', date: '2020-01-01' },
        { typeId: 'mni', date: '2020-01-02' },
        { typeId: 'rif', date: '2020-01-03' },
        { typeId: 'mio', date: '2020-01-04' },
        { typeId: 'rio', date: '2020-01-05' },
        { typeId: 'eof' }
      ])
    ).toHaveLength(0)
  })

  test('ne peut pas créer une "eof" juste après une "mio"', () => {
    expect(
      retEtatsValidate([
        { typeId: 'ide', date: '2020-01-01' },
        { typeId: 'mni', date: '2020-01-02' },
        { typeId: 'rif', date: '2020-01-03' },
        { typeId: 'mio', date: '2020-01-04' },
        { typeId: 'eof', date: '2020-01-05' }
      ])
    ).toEqual(['l’étape "eof" n’est pas possible juste après "mio"'])
  })

  test('peut créer une "css" apres une "mni"', () => {
    expect(
      retEtatsValidate([
        { typeId: 'ide' },
        { typeId: 'mni' },
        { typeId: 'css' }
      ])
    ).toHaveLength(0)
  })

  test('peut créer une "css" apres une "rif"', () => {
    expect(
      retEtatsValidate([
        { typeId: 'ide' },
        { typeId: 'mni' },
        { typeId: 'rif' },
        { typeId: 'css' }
      ])
    ).toHaveLength(0)
  })

  test('peut créer une "css" apres une "mio"', () => {
    expect(
      retEtatsValidate([
        { typeId: 'ide', date: '2020-01-01' },
        { typeId: 'mni', date: '2020-01-02' },
        { typeId: 'rif', date: '2020-01-03' },
        { typeId: 'mio', date: '2020-01-04' },
        { typeId: 'css', date: '2020-01-05' }
      ])
    ).toHaveLength(0)
  })
  test('peut créer une "css" apres une "eof"', () => {
    expect(
      retEtatsValidate([
        { typeId: 'ide' },
        { typeId: 'mni' },
        { typeId: 'rif' },
        { typeId: 'eof' },
        { typeId: 'css' }
      ])
    ).toHaveLength(0)
  })

  test('ne peut pas créer une "css" apres une "css"', () => {
    expect(
      retEtatsValidate([
        { typeId: 'ide', date: '2020-01-01' },
        { typeId: 'mni', date: '2020-01-01' },
        { typeId: 'css', date: '2020-01-01' },
        { typeId: 'css' }
      ])
    ).toEqual(['l’étape "css" ne peut-être effecutée 2 fois d’affilée'])
  })

  test('ne peut pas créer une "mni" juste après une "css"', () => {
    expect(
      retEtatsValidate([
        { typeId: 'css', date: '2020-01-02' },
        { typeId: 'mni', date: '2020-01-01' },
        { typeId: 'ide', date: '2020-01-01' },
        { typeId: 'mni', date: '2020-01-03' }
      ])
    ).toEqual(['l’étape "mni" n’est pas possible juste après "css"'])
  })
})
