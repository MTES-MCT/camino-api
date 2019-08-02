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
    return `type d'étape "${titreEtapeTypeId}" invalide pour une démarche de type ${titreDemarcheTypeNom}`
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
        `type d'étape "${titreEtapeCurrentTypeId}" invalide pour une démarche de type ${titreDemarcheTypeNom}`
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
      errorInvalidDate = `une étape de type ${titreEtapeTypeNom} ne peut pas être postérieure à une étape de type ${titreEtapeTypeCurrentNom}`
    }

    const isDateBefore =
      titreEtapeTypeOrdre > titreEtapeTypeCurrentOrdre &&
      titreEtapeDate < titreEtapeCurrentDate
    if (isDateBefore) {
      errorInvalidDate = `une étape de type ${titreEtapeTypeNom} ne peut pas être antérieure à une étape de type ${titreEtapeTypeCurrentNom}`
    }

    return isDateAfter || isDateBefore
  })

  return errorInvalidDate
}

export default titreEtapeDateCheck
