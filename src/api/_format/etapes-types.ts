import {
  IDemarcheType,
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
  etapeType: IEtapeType,
  demarcheTypeEtapesTypes: IEtapeType[],
  titreTypeId: string
) => {
  // cherche le type d'étape parmi les types d'étapes de la démarche
  // pour récupérer les sections spécifiques configurées dans t_d_e
  const demarcheEtapeType = demarcheTypeEtapesTypes.find(
    et => et.id === etapeType.id && et.titreTypeId === titreTypeId
  )

  let sectionsSpecifiques = [] as ISection[]

  if (demarcheEtapeType?.sectionsSpecifiques) {
    sectionsSpecifiques = demarcheEtapeType.sectionsSpecifiques
  }

  let sections = [] as ISection[]

  // fusion des sections par défaut de l'étape type
  // avec les sections spécifiques au type / démarche / étape
  // si deux sections ont la même id, seule la custom est conservée
  if (sectionsSpecifiques.length && etapeType.sections?.length) {
    sections = dupRemove(
      'id',
      sectionsSpecifiques,
      etapeType.sections
    ) as ISection[]
  } else if (sectionsSpecifiques.length) {
    sections = sectionsSpecifiques
  } else if (etapeType.sections?.length) {
    sections = etapeType.sections
  }

  return titreSectionsFormat(sections)
}

const etapeTypeFormat = (
  etapeType: IEtapeType,
  demarcheTypeEtapesTypes: IEtapeType[],
  titreTypeId: string
) => {
  etapeType.sections = etapeTypeSectionsFormat(
    etapeType,
    demarcheTypeEtapesTypes,
    titreTypeId
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

export { etapeTypeIsValidCheck, etapeTypeSectionsFormat, etapeTypeFormat }
