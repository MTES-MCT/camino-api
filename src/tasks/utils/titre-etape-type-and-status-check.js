// valide le type et le statut de l'étape en fonction du type de titre
// et du type de démarche

const titreEtapeTypeAndStatusCheck = (titreEtape, titreDemarche) => {
  const {
    etapesTypes: titreDemarcheEtapesTypes,
    nom: titreDemarcheTypeNom
  } = titreDemarche.type

  const { typeId: titreEtapeTypeId } = titreEtape

  const titreDemarcheEtapeType = titreDemarcheEtapesTypes.find(
    etapeType => etapeType.id === titreEtapeTypeId
  )
  if (!titreDemarcheEtapeType) {
    return `type d'étape "${titreEtapeTypeId}" invalide pour une démarche de type ${titreDemarcheTypeNom}`
  }

  const { statutId: titreEtapeStatutId } = titreEtape
  const titreEtapeStatut = titreDemarcheEtapeType.etapesStatuts.find(
    etapeStatut => etapeStatut.id === titreEtapeStatutId
  )
  if (!titreEtapeStatut) {
    return `statut de l'étape "${titreEtapeStatutId}" invalide pour une type d'étape de type ${
      titreDemarcheEtapeType.nom
    }`
  }

  return null
}

export default titreEtapeTypeAndStatusCheck
