// valide le type et le statut de l'étape en fonction du type de titre
// et du type de démarche
import titreEtapeDemarcheEtapeTypeFind from './titre-etape-demarche-etape-type-find'

const titreEtapeTypeAndStatusValidate = (titreEtape, titreDemarche) => {
  try {
    const titreDemarcheEtapeType = titreEtapeDemarcheEtapeTypeFind(
      titreDemarche.type,
      titreEtape.typeId
    )

    const { statutId: titreEtapeStatutId } = titreEtape
    const titreEtapeStatut = titreDemarcheEtapeType.etapesStatuts.find(
      etapeStatut => etapeStatut.id === titreEtapeStatutId
    )
    if (!titreEtapeStatut) {
      throw new Error(
        `statut de l'étape "${titreEtapeStatutId}" invalide pour une type d'étape de type ${titreDemarcheEtapeType.nom}`
      )
    }

    return null
  } catch (e) {
    return e.message
  }
}

export default titreEtapeTypeAndStatusValidate
