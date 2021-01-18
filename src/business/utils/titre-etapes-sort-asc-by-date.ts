import { ITitreEtape, IDemarcheType, ITravauxType } from '../../types'
import {
  etapeTypeIdDefinitionsGet,
  IEtapeTypeIdDefinition
} from '../demarches-etats-definitions/demarches-etats-definitions'

// classe les étapes selon leur dates, ordre et etapesTypes.ordre le cas échéant
const titreEtapesSortAscByDate = (
  titreEtapes: ITitreEtape[],
  type: 'travaux' | 'demarches',
  demarcheOrTravauxType?: IDemarcheType | ITravauxType | null,
  titreTypeId?: string
) => {
  let etapeTypeIdDefinitions = [] as IEtapeTypeIdDefinition[] | undefined
  let dateEtapeFirst = '' as string

  if (type === 'demarches' && titreTypeId && demarcheOrTravauxType?.id) {
    dateEtapeFirst = titreEtapes.map(te => te.date).sort()[0]

    etapeTypeIdDefinitions = etapeTypeIdDefinitionsGet(
      titreTypeId,
      demarcheOrTravauxType.id
    )
  }

  return titreEtapes.slice().sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)

    if (dateA < dateB) return -1
    if (dateA > dateB) return 1

    // si les deux étapes ont la même date

    // on utilise l'arbre pour trouver quelle étape provoque l’autre

    if (etapeTypeIdDefinitions?.length && dateEtapeFirst > '2019-10-31') {
      const bRestriction = etapeTypeIdDefinitions.find(
        r => r.etapeTypeId === b.typeId
      )

      if (
        bRestriction!.justeApres.flat(2).find(b => b?.etapeTypeId === a.typeId)
      ) {
        return -1
      }

      const aRestriction = etapeTypeIdDefinitions.find(
        r => r.etapeTypeId === a.typeId
      )

      if (
        aRestriction!.justeApres.flat(2).find(a => a?.etapeTypeId === b.typeId)
      ) {
        return 1
      }
    }

    // on utilise l'ordre du type d'étape

    if (!demarcheOrTravauxType?.etapesTypes?.length) {
      return a.ordre! - b.ordre!
    }

    const aType = demarcheOrTravauxType.etapesTypes.find(
      et => et.id === a.typeId && et.titreTypeId === titreTypeId
    )

    const bType = demarcheOrTravauxType.etapesTypes.find(
      et => et.id === b.typeId && et.titreTypeId === titreTypeId
    )

    if (!aType || !bType) return a.ordre! - b.ordre!

    return aType.ordre - bType.ordre || a.ordre! - b.ordre!
  })
}

export default titreEtapesSortAscByDate
