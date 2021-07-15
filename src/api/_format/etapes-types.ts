import {
  IDemarcheType,
  IDocumentType,
  IEtapeType,
  ISection,
  ITitre,
  ITitreEtape
} from '../../types'

import { titreDemarcheUpdatedEtatValidate } from '../../business/validations/titre-demarche-etat-validate'
import { titreDemarcheDepotDemandeDateFind } from '../../business/rules/titre-demarche-depot-demande-date-find'

import { dupRemove } from '../../tools/index'
import { titreSectionsFormat } from './titres-sections'

const etapeTypeSectionsFormat = (
  sections: ISection[] | undefined | null,
  sectionsSpecifiques: ISection[] | undefined | null
) => {
  let result: ISection[] = []

  if (sectionsSpecifiques?.length) {
    result.push(...sectionsSpecifiques)
  }

  // fusion des sections par défaut de l'étape type
  // avec les sections spécifiques au type / démarche / étape
  // si deux sections ont la même id, seule la custom est conservée
  if (result.length && sections?.length) {
    result = dupRemove('id', result, sections) as ISection[]
  } else if (sections?.length) {
    result = sections
  }

  return titreSectionsFormat(result)
}

const documentsTypesFormat = (
  documentsTypes: IDocumentType[] | undefined | null,
  documentsTypesSpecifiques: IDocumentType[] | undefined | null
): IDocumentType[] => {
  const result: IDocumentType[] = []

  if (documentsTypes?.length) {
    result.push(...documentsTypes)
  }

  if (documentsTypesSpecifiques?.length) {
    documentsTypesSpecifiques.forEach(documentTypeSpecifique => {
      const documentType = result.find(
        ({ id }) => id === documentTypeSpecifique.id
      )

      // Si il est déjà présent, on override juste son attribut « optionnel »
      if (documentType) {
        documentType.optionnel = documentTypeSpecifique.optionnel
      } else {
        result.push(documentTypeSpecifique)
      }
    })
  }

  return result
}

const etapeTypeFormat = (
  etapeType: IEtapeType,
  sectionsSpecifiques: ISection[] | null | undefined,
  documentsTypesSpecifiques: IDocumentType[] | null | undefined
) => {
  etapeType.sections = etapeTypeSectionsFormat(
    etapeType.sections,
    sectionsSpecifiques
  )

  // on ajoute les documents spécifiques
  etapeType.documentsTypes = documentsTypesFormat(
    etapeType.documentsTypes,
    documentsTypesSpecifiques
  )

  return etapeType
}

const etapeTypeDateFinCheck = (
  etapeType: IEtapeType,
  titreEtapes?: ITitreEtape[] | null
) => {
  if (!etapeType.dateFin || !titreEtapes) return true

  const dateDemande = titreDemarcheDepotDemandeDateFind(titreEtapes)

  // si
  // - la date de demande est absente,
  // - et le type d'étape a une date de fin
  // alors on ne propose pas ce type d'étape
  // Exemple: Si on a pas de date de demande, on ne peut pas proposer la « décision de l’ONF »
  // car cette étape est proposable que pour les demandes antérieures au 01/01/2020
  return dateDemande ? dateDemande < etapeType.dateFin : false
}

const etapeTypeIsValidCheck = (
  etapeType: IEtapeType,
  date: string,
  titre: ITitre,
  demarcheType: IDemarcheType,
  titreDemarcheEtapes?: ITitreEtape[] | null,
  titreEtape?: ITitreEtape
) => {
  const isDateFinValid = etapeTypeDateFinCheck(etapeType, titreDemarcheEtapes)

  if (!isDateFinValid) return false

  if (!titreEtape) {
    titreEtape = {} as ITitreEtape
  }

  titreEtape.typeId = etapeType.id
  titreEtape.date = date

  const etapeTypeIsValid = !titreDemarcheUpdatedEtatValidate(
    demarcheType,
    titre,
    titreEtape,
    titreDemarcheEtapes
  ).length

  return etapeTypeIsValid
}

export {
  etapeTypeIsValidCheck,
  etapeTypeSectionsFormat,
  etapeTypeFormat,
  documentsTypesFormat
}
