// classe les étapes selon leur dates
const titreEtapesAscSortByDate = titreEtapes =>
  titreEtapes.sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)

    return dateA < dateB ? -1 : dateA > dateB ? 1 : a.ordre - b.ordre
  })

export default titreEtapesAscSortByDate
