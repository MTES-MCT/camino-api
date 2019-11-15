// classe les étapes selon leur dates, ordre et etapesTypes.ordre le cas échéant
const titreEtapesAscSortByDate = (titreEtapes, { etapesTypes = [] } = {}) =>
  titreEtapes.sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)

    if (dateA < dateB) return -1
    if (dateA > dateB) return 1
    if (!etapesTypes.length) return a.ordre - b.ordre

    const aType = etapesTypes.find(et => a.typeId === et.id)
    const bType = etapesTypes.find(et => b.typeId === et.id)

    return aType && bType ? aType.ordre - bType.ordre : 0
  })

export default titreEtapesAscSortByDate
