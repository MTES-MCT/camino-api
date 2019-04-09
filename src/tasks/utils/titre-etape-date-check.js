import titreEtapesAscSort from './titre-etapes-asc-sort'

// valide le type et le statut de l'étape en fonction du type de titre
// et du type de démarche

const titreEtapeTypeAndStatusCheck = (
  titreEtape,
  titreDemarche,
  titre,
  titreDemarcheEtapesTypes
) => {
  const { typeId: titreTypeId } = titre
  const titreEtapeTypes = titreDemarcheEtapesTypes.filter(
    et => et.typeId === titreTypeId
  )

  const titreEtapes = titreEtapesAscSort(titreDemarche.etapes)

  const titreEtapeType = titreEtapeTypes.find(et => et.id === titreEtape.typeId)

  const { id: titreEtapeId, date } = titreEtape
  const titreEtapeDate = new Date(date)
  const { ordre: titreEtapeTypeOrdre } = titreEtapeType

  let invalidDate

  titreEtapes.some(titreEtapeCurrent => {
    if (titreEtapeCurrent.id === titreEtapeId) return false

    const titreEtapeTypeCurrent = titreEtapeTypes.find(
      td => td.id === titreEtapeCurrent.typeId
    )

    const isDateAfter =
      titreEtapeTypeOrdre < titreEtapeTypeCurrent.ordre &&
      titreEtapeDate > titreEtapeCurrent.date
    if (isDateAfter) {
      invalidDate = `date d'étape ${titreEtapeType.id} postérieure`
    }

    const isDateBefore =
      titreEtapeTypeOrdre > titreEtapeTypeCurrent.ordre &&
      titreEtapeDate < titreEtapeCurrent.date
    if (isDateBefore) {
      invalidDate = `date d'étape ${titreEtapeType.id} antérieure`
    }

    return isDateAfter || isDateBefore
  })

  return invalidDate
}

export default titreEtapeTypeAndStatusCheck
