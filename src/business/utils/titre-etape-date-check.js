import titreEtapesAscSort from './titre-etapes-asc-sort'

// valide le type et le statut de l'étape en fonction du type de titre
// et du type de démarche

const titreEtapeDateCheck = (titreEtape, titreDemarche) => {
  const {
    etapesTypes: titreDemarcheEtapesTypes,
    nom: titreDemarcheTypeNom
  } = titreDemarche.type

  const titreEtapes = titreEtapesAscSort(titreDemarche.etapes)

  const { typeId: titreEtapeTypeId } = titreEtape

  const titreDemarcheEtapeType = titreDemarcheEtapesTypes.find(
    etapeType => etapeType.id === titreEtapeTypeId
  )
  if (!titreDemarcheEtapeType) {
    return `étape "${titreEtapeTypeId}" invalide pour une démarche ${titreDemarcheTypeNom}`
  }

  let { id: titreEtapeId, date: titreEtapeDate } = titreEtape
  titreEtapeDate = new Date(titreEtapeDate)

  const {
    ordre: titreEtapeTypeOrdre,
    nom: titreEtapeTypeNom
  } = titreDemarcheEtapeType

  let errorInvalidDate = null

  titreEtapes.some(titreEtapeCurrent => {
    if (titreEtapeCurrent.id === titreEtapeId) return false

    const {
      typeId: titreEtapeCurrentTypeId,
      date: titreEtapeCurrentDate
    } = titreEtapeCurrent

    const titreEtapeTypeCurrent = titreDemarcheEtapesTypes.find(
      etapeType => etapeType.id === titreEtapeCurrentTypeId
    )
    if (!titreEtapeTypeCurrent) {
      console.warn(
        `étape "${titreEtapeCurrentTypeId}" invalide pour une démarche ${titreDemarcheTypeNom}`
      )

      return false
    }

    const {
      ordre: titreEtapeTypeCurrentOrdre,
      nom: titreEtapeTypeCurrentNom
    } = titreEtapeTypeCurrent

    const isDateAfter =
      titreEtapeTypeOrdre < titreEtapeTypeCurrentOrdre &&
      titreEtapeDate > titreEtapeCurrentDate
    if (isDateAfter) {
      errorInvalidDate = `une étape ${titreEtapeTypeNom} ne peut pas être postérieure à une étape ${titreEtapeTypeCurrentNom}`
    }

    const isDateBefore =
      titreEtapeTypeOrdre > titreEtapeTypeCurrentOrdre &&
      titreEtapeDate < titreEtapeCurrentDate
    if (isDateBefore) {
      errorInvalidDate = `une étape ${titreEtapeTypeNom} ne peut pas être antérieure à une étape ${titreEtapeTypeCurrentNom}`
    }

    return isDateAfter || isDateBefore
  })

  return errorInvalidDate
}

export default titreEtapeDateCheck
