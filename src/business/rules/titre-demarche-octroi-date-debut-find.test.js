import titreDemarcheOctroiDateDebutFind from './titre-demarche-octroi-date-debut-find'

describe("trouve la date d'octroi d'un titre", () => {
  test("retourne 0000 si le titre n'a pas de démarches", () => {
    expect(titreDemarcheOctroiDateDebutFind(null)).toEqual('0000')
    expect(titreDemarcheOctroiDateDebutFind([])).toEqual('0000')
  })

  test("retourne 0000 si les démarches ne contiennent pas d'octroi ou de mutation partielle", () => {
    expect(titreDemarcheOctroiDateDebutFind([{ typeId: 'rnd' }])).toEqual(
      '0000'
    )
    expect(titreDemarcheOctroiDateDebutFind([{ typeId: 'oct' }])).toEqual(
      '0000'
    )
    expect(
      titreDemarcheOctroiDateDebutFind([{ typeId: 'oct', etapes: [] }])
    ).toEqual('0000')
  })

  test("retourne la date de l'étape acceptée de la démarche d'octroi", () => {
    expect(
      titreDemarcheOctroiDateDebutFind([
        {
          typeId: 'oct',
          statutId: 'acc',
          etapes: [{ typeId: 'dpu', date: '2002-02-02' }]
        }
      ])
    ).toEqual('2002-02-02')
  })

  test("retourne la date de l'étape de demande de la démarche d'octroi", () => {
    expect(
      titreDemarcheOctroiDateDebutFind([
        {
          typeId: 'oct',
          etapes: [{ typeId: 'mfr', dateDebut: '2002-02-02' }]
        }
      ])
    ).toEqual('2002-02-02')
  })

  test("retourne la date de la première étape de la démarche d'octroi", () => {
    expect(
      titreDemarcheOctroiDateDebutFind([
        {
          typeId: 'oct',
          etapes: [
            { typeId: 'rnb', dateDebut: '2003-03-03' },
            { typeId: 'rnd', dateDebut: '2002-02-02' }
          ]
        }
      ])
    ).toEqual('2002-02-02')
  })
})
