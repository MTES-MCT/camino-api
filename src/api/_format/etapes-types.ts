import {
  ITitre,
  IDemarcheType,
  ITitreDemarche,
  ITitreEtape,
  IEtapeType,
  ISection
} from '../../types'

import titreEtapeDateValidate from '../../business/utils/titre-etape-date-validate'
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
  titre: ITitre,
  demarcheType: IDemarcheType,
  titreDemarcheEtapes: ITitreEtape[],
  etapeTypeId?: string,
  etapeStatutId?: string,
  date?: string
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

    // TODO: filtrer les types d'étapes avec type.dateFin
    // en fonction de la date du titre
    const isValid = !titreEtapeDateValidate(
      etapeType.id,
      etapeStatut.id,
      date || '3000-01-01',
      demarcheType,
      titreDemarcheEtapes,
      titre
    )

    return isValid
  })

const etapeTypeDateFinCheck = (
  etapeType: IEtapeType,
  titreDemarches: ITitreDemarche[],
  titreStatutId: string
) => {
  if (!etapeType.dateFin) return true

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
  etapeTypeId?: string,
  etapeStatutId?: string,
  date?: string
) => {
  const isDateFinValid = etapeTypeDateFinCheck(
    etapeType,
    titre.demarches!,
    titre.statutId!
  )

  if (!isDateFinValid) return null

  const etapesStatutsFormatted = etapeTypeEtapesStatutsFormat(
    etapeType,
    titre,
    demarcheType,
    titreDemarcheEtapes,
    etapeTypeId,
    etapeStatutId,
    date
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
