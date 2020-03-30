import {
  ITitre,
  IDemarcheType,
  ITitreEtape,
  IEtapeType,
  ISection
} from '../../../types'

import titreEtapeDateValidate from '../../../business/utils/titre-etape-date-validate'

import { dupRemove } from '../../../tools/index'
import { titreSectionsFormat } from './titres-sections'

const etapeTypeSectionsFormat = (
  etapeType: IEtapeType,
  demarcheTypeEtapesTypes: IEtapeType[],
  titreTypeId: string
) => {
  // cherche le type d'étape parmi les types d'étapes de la démarche
  // pour récupérer les sections spécifiques configurées dans t_d_e
  const demarcheEtapeType = demarcheTypeEtapesTypes.find(et =>
    et.id === etapeType.id &&
    et.titreTypeId === titreTypeId
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
  titre: ITitre,
  demarcheType: IDemarcheType,
  titreDemarcheEtapes: ITitreEtape[],
  etapeTypeId?: string,
  etapeStatutId?: string
) =>
  // restreint la liste des statuts disponibles pour le type d'étape
  etapeType.etapesStatuts!.filter(etapeStatut => {
    // si on est en train d'éditer une étape
    // et le type d'étape courant est celui de l'étape dont l'édition est en cours
    if (etapeTypeId && etapeType.id === etapeTypeId) {
      // si le statut du type d'étape est celui de l'étape dont l'édition est en cours
      // on le propose dans la liste des statuts de type d'étape
      if (etapeStatutId && etapeStatut.id === etapeStatutId) return true

      // sinon,
      // (le statut d'étape courant est différent de celui de l'étape dont l'édition est en cours)
      // alors on filtre les étapes de type différent au sein de la démarche
      // car la fonction de validation peut retourner une erreur
      // si des étapes de ce type existent déjà
      titreDemarcheEtapes = titreDemarcheEtapes.filter(
        e => e.typeId !== etapeTypeId
      )
    }

    // TODO: utiliser la date de l'étape éditée
    const isValid = !titreEtapeDateValidate(
      etapeType.id,
      etapeStatut.id,
      // TODO: filtrer les types d'étapes avec type.dateFin
      // en fonction de la date du titre
      '3000-01-01',
      demarcheType,
      titreDemarcheEtapes,
      titre
    )

    return isValid
  })


const etapeTypeFormat = (
  etapeType: IEtapeType,
  titre: ITitre,
  demarcheType: IDemarcheType,
  titreDemarcheEtapes: ITitreEtape[],
  etapeTypeId?: string,
  etapeStatutId?: string
) => {
  const etapesStatutsFormatted = etapeTypeEtapesStatutsFormat(
    etapeType,
    titre,
    demarcheType,
    titreDemarcheEtapes,
    etapeTypeId,
    etapeStatutId
  )
  // si aucun statut n'est disponible pour ce type d'étape
  // alors on ne retourne pas ce type d'étape pendant l'édition
  if (!etapesStatutsFormatted.length) return null

  etapeType.etapesStatuts = etapesStatutsFormatted

  etapeType.demarcheTypeId = demarcheType.id

  return etapeTypeSectionsFormat(
    etapeType,
    demarcheType.etapesTypes,
    titre.typeId
  )
}

export { etapeTypeFormat, etapeTypeSectionsFormat }
