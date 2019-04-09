// valide le type et le statut de l'étape en fonction du type de titre
// et du type de démarche

const titreEtapeTypeAndStatusCheck = (
  titreEtape,
  titre,
  titreDemarcheEtapesTypes
) => {
  const { typeId: titreEtapeTypeId } = titreEtape
  const titreDemarcheEtapeTypes = titreDemarcheEtapesTypes.filter(
    td => td.id === titreEtapeTypeId
  )
  if (!titreDemarcheEtapeTypes.length) {
    return "type d'étape invalide pour la démarche"
  }

  const { typeId: titreTypeId } = titre
  const titreEtapeType = titreDemarcheEtapeTypes.find(
    et => et.typeId === titreTypeId
  )
  if (!titreEtapeType) {
    return "type d'étape invalide pour le type de titre"
  }

  const { statutId: titreEtapeStatutId } = titreEtape
  const titreEtapeStatut = titreEtapeType.etapesStatuts.find(
    td => td.id === titreEtapeStatutId
  )
  if (!titreEtapeStatut) {
    return "statut de l'étape invalide pour le type d'étape"
  }

  return null
}

export default titreEtapeTypeAndStatusCheck
