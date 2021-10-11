import { ITitreEtape, IDemarcheType } from '../../types'
import {
  demarcheDefinitionFind,
  IDemarcheDefinition,
  IDemarcheDefinitionRestrictions
} from '../rules-demarches/definitions'
import { titreDemarcheDepotDemandeDateFind } from '../rules/titre-demarche-depot-demande-date-find'

// classe les étapes selon leur dates, ordre et etapesTypes.ordre le cas échéant
const titreEtapesSortAscByDate = (
  titreEtapes: ITitreEtape[],
  demarcheType?: IDemarcheType | null,
  titreTypeId?: string
) => {
  let demarcheDefinitionRestrictions = undefined as
    | IDemarcheDefinitionRestrictions
    | undefined

  let demarcheDefinition = undefined as IDemarcheDefinition | undefined
  let dateEtapeFirst = '' as string

  if (titreTypeId && demarcheType?.id) {
    dateEtapeFirst = titreDemarcheDepotDemandeDateFind(titreEtapes)

    demarcheDefinition = demarcheDefinitionFind(titreTypeId, demarcheType.id)

    demarcheDefinitionRestrictions = demarcheDefinition?.restrictions
  }

  return titreEtapes.slice().sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)

    if (dateA < dateB) return -1
    if (dateA > dateB) return 1

    // si les deux étapes ont la même date

    // on utilise l'arbre pour trouver quelle étape provoque l’autre

    if (
      demarcheDefinition &&
      demarcheDefinitionRestrictions &&
      dateEtapeFirst > demarcheDefinition.dateDebut
    ) {
      const bRestriction = demarcheDefinitionRestrictions[b.typeId]

      if (!bRestriction) {
        console.error(
          `impossible de trier l’étape ${b.id} car son type ${b.typeId} n’existe pas dans les définitions`
        )

        return -1
      }

      const aRestriction = demarcheDefinitionRestrictions[a.typeId]

      if (!aRestriction) {
        console.error(
          `impossible de trier l’étape ${a.id} car son type ${a.typeId} n’existe pas dans les définitions`
        )

        return -1
      }

      const bJusteApresA = bRestriction.justeApres
        .flat(2)
        .find(b => b.etapeTypeId === a.typeId)

      const aJusteApresB = aRestriction.justeApres
        .flat(2)
        .find(a => a.etapeTypeId === b.typeId)

      if (bJusteApresA && !aJusteApresB) {
        return -1
      }

      if (aJusteApresB && !bJusteApresA) {
        return 1
      }

      if (aRestriction.final) {
        return 1
      }

      if (bRestriction.final) {
        return -1
      }
    }

    // on utilise l'ordre du type d'étape

    if (!demarcheType?.etapesTypes?.length) {
      return a.ordre! - b.ordre!
    }

    const aType = demarcheType.etapesTypes.find(
      et => et.id === a.typeId && et.titreTypeId === titreTypeId
    )

    const bType = demarcheType.etapesTypes.find(
      et => et.id === b.typeId && et.titreTypeId === titreTypeId
    )

    if (aType && bType) return aType.ordre - bType.ordre

    return a.ordre! - b.ordre!
  })
}

export default titreEtapesSortAscByDate
