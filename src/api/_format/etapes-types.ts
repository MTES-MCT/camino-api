import {
  ITitre,
  IDemarcheType,
  ITitreDemarche,
  ITitreEtape,
  IEtapeType,
  ISection
} from '../../types'

import { titreArbreTypeIdValidate } from '../../business/utils/titre-arbre-type-validate'
import titreDateDemandeFind from '../../business/rules/titre-date-demande-find'

import { dupRemove } from '../../tools/index'
import { titreSectionsFormat } from './titres-sections'
import { arbreTypeIdsGet } from '../../business/arbres-demarches/arbres-demarches'

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
  titreEtape: ITitreEtape
) =>
  // restreint la liste des statuts disponibles pour le type d'étape
  etapeType.etapesStatuts!.filter(etapeStatut => {
    // si on est en train d'éditer une étape
    // et le type d'étape courant est celui de l'étape dont l'édition est en cours
    if (titreEtape?.typeId && etapeType.id === titreEtape.typeId) {
      // si le statut du type d'étape est celui de l'étape dont l'édition est en cours
      // on le propose dans la liste des statuts de type d'étape
      if (titreEtape.statutId && etapeStatut.id === titreEtape.statutId)
        return true

      // sinon,
      // (le statut d'étape courant est différent de celui de l'étape dont l'édition est en cours)
      // alors on filtre les étapes de type différent au sein de la démarche
      // car la fonction de validation peut retourner une erreur
      // si des étapes de ce type existent déjà
      titreDemarcheEtapes = titreDemarcheEtapes.filter(
        e => e.typeId !== titreEtape.typeId
      )
    }

    const isValid = !titreArbreTypeIdValidate(
      demarcheType,
      titreDemarcheEtapes,
      titre,
      titreEtape
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
  titreEtape?: ITitreEtape
) => {
  const isDateFinValid = etapeTypeDateFinCheck(
    etapeType,
    titre.demarches!,
    titre.statutId!
  )

  if (!isDateFinValid) return null

  // Une étape peut-être présente plusieurs fois dans une démarche.
  // pour les rendre uniques, nous utilisons les arbreTypeIds
  const arbreTypeIds = arbreTypeIdsGet(
    titre.typeId,
    demarcheType.id,
    etapeType.id
  )

  return arbreTypeIds.reduce((acc: IEtapeType[], arbreTypeId) => {
    const etapeTypeCopy = JSON.parse(JSON.stringify(etapeType))
    const etapesStatutsFormatted = etapeTypeEtapesStatutsFormat(
      etapeTypeCopy,
      titre,
      demarcheType,
      titreDemarcheEtapes,
      titreEtape
        ? { ...titreEtape, arbreTypeId }
        : ({ arbreTypeId } as ITitreEtape)
    )

    // si aucun statut n'est disponible pour ce type d'étape
    // alors on ne retourne pas ce type d'étape pendant l'édition
    if (!etapesStatutsFormatted.length) return acc

    etapeTypeCopy.etapesStatuts = etapesStatutsFormatted

    etapeTypeCopy.demarcheTypeId = demarcheType.id
    etapeTypeCopy.arbreTypeId = arbreTypeId

    acc.push(
      etapeTypeSectionsFormat(
        etapeTypeCopy,
        demarcheType.etapesTypes,
        titre.typeId
      )
    )

    return acc
  }, [])
}

export { etapeTypeFormat, etapeTypeSectionsFormat }
