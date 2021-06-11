import dateFormat from 'dateformat'

const dateValidate = (str: string | undefined | null) => {
  if (!str) return 'Date manquante'

  const date = new Date(str)

  if (date.toString() === 'Invalid Date') {
    return 'Date invalide'
  }

  return null
}

// ajoute une durée en jours à une string au format YYYY-MM-DD
const dateAddDays = (date: string, days: number) => {
  const [y, m, d] = date.split('-')

  return dateFormat(new Date(+y, +m - 1, +d + days), 'yyyy-mm-dd')
}

// ajoute une durée en mois à une string au format YYYY-MM-DD
const dateAddMonths = (date: string, months: number) => {
  const [y, m, d] = date.split('-')

  return dateFormat(new Date(+y, +m - 1 + months, +d), 'yyyy-mm-dd')
}

// calcul le nombre de mois entre 2 dates
const datesSubtract = (dateDebut: string, dateFin: string) => {
  const [yDebut, mDebut] = dateDebut.split('-')
  const [yFin, mFin] = dateFin.split('-')

  return +yFin * 12 + +mFin - (+yDebut * 12 + +mDebut)
}

const datesDiffInDays = (a: Date, b: Date) => {
  const utc1 = Date.UTC(
    a.getFullYear(),
    a.getMonth(),
    a.getDate(),
    a.getHours(),
    a.getMinutes()
  )
  const utc2 = Date.UTC(
    b.getFullYear(),
    b.getMonth(),
    b.getDate(),
    b.getHours(),
    b.getMinutes()
  )

  return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24))
}

export {
  dateValidate,
  dateAddMonths,
  dateAddDays,
  datesSubtract,
  datesDiffInDays
}
