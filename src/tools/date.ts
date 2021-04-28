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

export { dateValidate, dateAddMonths, dateAddDays, datesSubtract }
