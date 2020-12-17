import {
  IDemarcheType,
  IEtapeType,
  ISection,
  ITitre,
  ITitreDemarche,
  ITitreEtape
} from '../../types'

import { titreEtapeTypeIdValidate } from '../../business/utils/titre-demarche-etats-validate'
import titreDateDemandeFind from '../../business/rules/titre-date-demande-find'

import { dupRemove } from '../../tools/index'
import { titreSectionsFormat } from './titres-sections'

const etapeTypeSectionsFormat = (
  etapeType: IEtapeType,
  demarcheTypeEtapesTypes: IEtapeType[],
  titreTypeId: string
) => {
  // cherche le type d'étape parmi les types d'étapes de la démarche
  // pour récupérer les sections spécifiques configurées dans t_d_e
  const demarcheEtapeType = demarcheTypeEtapesTypes.find(
    et => et.id === etapeType.id && et.titreTypeId === titreTypeId
  )

  if (demarcheEtapeType?.sectionsSpecifiques) {
    etapeType.sectionsSpecifiques = demarcheEtapeType.sectionsSpecifiques
  }

  // fusion des sections par défaut de l'étape type
  // avec les sections spécifiques au type / démarche / étape
  // si deux sections ont la même id, seule la custom est conservée
  if (etapeType.sectionsSpecifiques) {
    etapeType.sections = etapeType.sections
      ? (dupRemove(
          'id',
          etapeType.sectionsSpecifiques,
          etapeType.sections
        ) as ISection[])
      : etapeType.sectionsSpecifiques
  }

  if (etapeType.sections) {
    etapeType.sections = titreSectionsFormat(etapeType.sections)
  }

  return etapeType
}

const etapeTypeEtapesStatutsFormat = (
  etapeType: IEtapeType,
  titreEtapeTypeId: string,
  titreEtapeStatutId: string | undefined,
  etapeTypeIsValid: boolean
) =>
  // restreint la liste des statuts disponibles pour le type d'étape
  etapeType.etapesStatuts!.filter(etapeStatut => {
    // si on est en train d'éditer une étape
    // et le type d'étape courant est celui de l'étape dont l'édition est en cours
    // si le statut du type d'étape est celui de l'étape dont l'édition est en cours
    // on le propose dans la liste des statuts de type d'étape
    if (
      titreEtapeTypeId &&
      etapeType.id === titreEtapeTypeId &&
      titreEtapeStatutId &&
      etapeStatut.id === titreEtapeStatutId
    )
      return true

    return etapeTypeIsValid
  })

const etapeTypeDateFinCheck = (
  etapeType: IEtapeType,
  titreDemarches: ITitreDemarche[],
  titreStatutId: string
) => {
  if (!etapeType.dateFin) return true

  // FIXME je ne suis pas certain que ça soit la date souhaitée
  const dateDemande = titreDateDemandeFind(titreDemarches, titreStatutId)

  // si
  // - la date de demande est absente,
  // - et le type d'étape a une date de fin
  // alors on ne propose pas ce type d'étape
  // Exemple: Si on a pas de date de demande, on ne peut pas proposer la « décision de l’ONF »
  // car cette étape est proposable que pour les demandes antérieures au 01/01/2020
  return dateDemande ? dateDemande < etapeType.dateFin : false
}

const etapeTypeFormat = (
  etapeType: IEtapeType,
  titre: ITitre,
  demarcheType: IDemarcheType,
  titreDemarcheEtapes: ITitreEtape[],
  titreEtape?: ITitreEtape
) => {
  const isDateFinValid = etapeTypeDateFinCheck(
    etapeType,
    titre.demarches!,
    titre.statutId!
  )

  if (!isDateFinValid) return null

  const etapeTypeCopy = JSON.parse(JSON.stringify(etapeType))

  // FIXME
  // (le statut d'étape courant est différent de celui de l'étape dont l'édition est en cours)
  // alors on filtre les étapes de type différent au sein de la démarche
  // car la fonction de validation peut retourner une erreur
  // si des étapes de ce type existent déjà
  const etapeTypeIsValid = !titreEtapeTypeIdValidate(
    demarcheType,
    titreDemarcheEtapes,
    titre,
    titreEtape ? { ...titreEtape } : ({ typeId: etapeType.id } as ITitreEtape)
  )

  const etapesStatutsFormatted = etapeTypeEtapesStatutsFormat(
    etapeTypeCopy,
    titreEtape ? titreEtape.typeId : etapeType.id,
    titreEtape?.statutId,
    etapeTypeIsValid
  )

  // si aucun statut n'est disponible pour ce type d'étape
  // alors on ne retourne pas ce type d'étape pendant l'édition
  if (!etapesStatutsFormatted.length) return undefined

  etapeTypeCopy.etapesStatuts = etapesStatutsFormatted

  etapeTypeCopy.demarcheTypeId = demarcheType.id

  return etapeTypeSectionsFormat(
    etapeTypeCopy,
    demarcheType.etapesTypes,
    titre.typeId
  )
}

export { etapeTypeFormat, etapeTypeSectionsFormat }
