import {
  dateAddDays,
  dateAddMonths,
  datesDiffInDays,
  datesSubtract,
  dateValidate
} from './date'

describe('test les utilitaires de date', () => {
  test("retourne une erreur si aucune date n'est fournie", () => {
    const res = dateValidate(null)

    expect(res).toBe('Date manquante')
  })

  test('retourne null si la date est valide', () => {
    const res = dateValidate('1910-01-01')

    expect(res).toBe(null)
  })

  test('retourne une erreur la date est invalide', () => {
    const res = dateValidate('1910-123123123-123123113')

    expect(res).toBe('Date invalide')
  })

  test.each`
    date            | days  | result
    ${'2020-01-01'} | ${1}  | ${'2020-01-02'}
    ${'2020-01-01'} | ${10} | ${'2020-01-11'}
    ${'2020-01-01'} | ${31} | ${'2020-02-01'}
    ${'2020-12-31'} | ${1}  | ${'2021-01-01'}
  `(
    'ajoute des jours à une date',
    ({
      date,
      days,
      result
    }: {
      date: string
      days: number
      result: string
    }) => {
      expect(dateAddDays(date, days)).toBe(result)
    }
  )

  test.each`
    date            | months | result
    ${'2020-01-01'} | ${1}   | ${'2020-02-01'}
    ${'2020-01-01'} | ${12}  | ${'2021-01-01'}
  `(
    'ajoute des mois à une date',
    ({
      date,
      months,
      result
    }: {
      date: string
      months: number
      result: string
    }) => {
      expect(dateAddMonths(date, months)).toBe(result)
    }
  )

  test.each`
    dateFin         | dateDebut       | months
    ${'2020-03-10'} | ${'2020-01-07'} | ${2}
    ${'2021-01-01'} | ${'2020-01-01'} | ${12}
  `(
    'calcul le nombre de mois entre 2 dates',
    ({
      dateFin,
      dateDebut,
      months
    }: {
      dateFin: string
      dateDebut: string
      months: number
    }) => {
      expect(datesSubtract(dateDebut, dateFin)).toBe(months)
    }
  )

  test.each`
    date1                         | date2                         | days
    ${'2020-06-02T13:35:11.366Z'} | ${'2021-06-03T13:35:11.366Z'} | ${366}
    ${'2021-06-02T13:35:11.366Z'} | ${'2021-06-03T13:35:11.366Z'} | ${1}
    ${'2021-06-02T13:35:11.366Z'} | ${'2021-06-02T13:40:11.366Z'} | ${0}
    ${'2021-06-02T13:35:11.366Z'} | ${'2021-06-03T11:30:11.366Z'} | ${0}
  `(
    'calcul le nombre de jours entre 2 dates',
    ({
      date1,
      date2,
      days
    }: {
      date1: string
      date2: string
      days: number
    }) => {
      expect(datesDiffInDays(new Date(date1), new Date(date2))).toBe(days)
    }
  )
})
