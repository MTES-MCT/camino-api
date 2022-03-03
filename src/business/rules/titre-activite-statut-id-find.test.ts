import {
  titreActiviteDateDelaiFind,
  titreActiviteStatutIdFind
} from './titre-activite-statut-id-find'

import {
  titreActiviteFermee,
  titreActiviteDeposee,
  titreActiviteAbsenteDelaiDepasse,
  titreActiviteEnCoursDelaiNonDepasse
} from './__mocks__/titre-activite-statut-id-find-activites'

describe("statut d'une activité", () => {
  test('une activité dont le statut est “fermé" garde le statut "fermé"', () => {
    expect(
      titreActiviteStatutIdFind(titreActiviteFermee, '2020-12-31')
    ).toEqual(titreActiviteFermee.statutId)
  })

  test('une activité dont le statut est “déposé" garde le statut "déposé"', () => {
    expect(
      titreActiviteStatutIdFind(titreActiviteDeposee, '2020-12-31')
    ).toEqual(titreActiviteDeposee.statutId)
  })

  test('une activité dont statut est "abs" et le délai est dépassé a le statut “fermé', () => {
    expect(
      titreActiviteStatutIdFind(titreActiviteAbsenteDelaiDepasse, '2020-12-31')
    ).toEqual('fer')
  })

  test('une activité dont le statut est "enc" dont le délai n\'est pas dépassé ne change pas de statut', () => {
    expect(
      titreActiviteStatutIdFind(
        titreActiviteEnCoursDelaiNonDepasse,
        '2020-12-31'
      )
    ).toEqual(titreActiviteEnCoursDelaiNonDepasse.statutId)
  })

  test.each`
    date            | delaiMois | dateDelai
    ${'2020-01-01'} | ${3}      | ${'2020-04-01'}
    ${'2020-01-30'} | ${3}      | ${'2020-04-30'}
    ${'2020-01-31'} | ${3}      | ${'2020-05-01'}
    ${'2020-12-01'} | ${3}      | ${'2021-03-01'}
  `(
    `une activité créée le $date avec un délai de $delaiMois mois se termine le $dateDelai`,
    ({
      date,
      delaiMois,
      dateDelai
    }: {
      date: string
      delaiMois: number
      dateDelai: string
    }) => {
      expect(titreActiviteDateDelaiFind(date, delaiMois)).toEqual(dateDelai)
    }
  )
})
