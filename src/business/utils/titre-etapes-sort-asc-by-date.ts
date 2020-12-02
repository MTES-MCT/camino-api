import { ITitreEtape, IDemarcheType, ITravauxType } from '../../types'

// classe les étapes selon leur dates, ordre et etapesTypes.ordre le cas échéant
const titreEtapesSortAscByDate = (
  titreEtapes: ITitreEtape[],
  demarcheOrTravauxType?: IDemarcheType | ITravauxType | null,
  titreTypeId?: string
) =>
  titreEtapes.slice().sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)

    if (dateA < dateB) return -1
    if (dateA > dateB) return 1

    // si les deux étapes ont la même date
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

export default titreEtapesSortAscByDate
