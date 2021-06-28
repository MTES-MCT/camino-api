import { demarcheEtatsValidate } from '../_utils.test'

describe('vérifie l’arbre d’octroi d’une PRM', () => {
  const octEtatsValidate = demarcheEtatsValidate('oct', 'prm')

  test('ne peut pas créer une "rpu" après une "dex" rejetée', () => {
    expect(
      octEtatsValidate([
        { typeId: 'mfr', date: '2020-01-01', statutId: 'dep' },
        { typeId: 'spp', date: '2020-01-03' },
        { typeId: 'mcr', statutId: 'fav', date: '2020-01-04' },
        { typeId: 'anf', date: '2020-01-05' },
        { typeId: 'mec', date: '2020-01-06' },
        { typeId: 'ppu', date: '2020-01-07' },
        { typeId: 'ppc', date: '2020-01-08' },
        { typeId: 'scl', date: '2020-01-07' },
        { typeId: 'ssr', date: '2020-01-07' },
        { typeId: 'spo', date: '2020-01-08' },
        { typeId: 'apo', date: '2020-01-09' },
        { typeId: 'apd', date: '2020-01-10' },
        { typeId: 'app', date: '2020-01-11' },
        { typeId: 'scg', date: '2020-01-12' },
        { typeId: 'rcg', date: '2020-01-13' },
        { typeId: 'acg', date: '2020-01-14' },
        { typeId: 'sas', date: '2020-01-15' },
        { typeId: 'dex', statutId: 'rej', date: '2020-01-16' },
        { typeId: 'npp', date: '2020-01-17' },
        { typeId: 'mno', date: '2020-01-18' },
        { typeId: 'rpu', date: '2020-01-19' }
      ])
    ).toContain(
      'l’étape "rpu" n’est pas possible après "ssr", "scl", "npp", "mno"'
    )
  })

  test('peut créer une "rpu" après une "dex" acceptée', () => {
    expect(
      octEtatsValidate([
        { typeId: 'mfr', date: '2020-01-01', statutId: 'dep' },
        { typeId: 'spp', date: '2020-01-03' },
        { typeId: 'mcr', statutId: 'fav', date: '2020-01-04' },
        { typeId: 'anf', date: '2020-01-05' },
        { typeId: 'mec', date: '2020-01-06' },
        { typeId: 'ppu', date: '2020-01-07' },
        { typeId: 'ppc', date: '2020-01-08' },
        { typeId: 'scl', date: '2020-01-07' },
        { typeId: 'ssr', date: '2020-01-07' },
        { typeId: 'spo', date: '2020-01-08' },
        { typeId: 'apo', date: '2020-01-09' },
        { typeId: 'apd', date: '2020-01-10' },
        { typeId: 'app', date: '2020-01-11' },
        { typeId: 'scg', date: '2020-01-12' },
        { typeId: 'rcg', date: '2020-01-13' },
        { typeId: 'acg', date: '2020-01-14' },
        { typeId: 'sas', date: '2020-01-15' },
        { typeId: 'dex', statutId: 'acc', date: '2020-01-16' },
        { typeId: 'dpu', statutId: 'acc', date: '2020-01-17' },
        { typeId: 'npp', date: '2020-01-18' },
        { typeId: 'mno', date: '2020-01-19' },
        { typeId: 'rpu', date: '2020-01-19' }
      ])
    ).toHaveLength(0)
  })
})
