// classe les démarches selon la date de leur première étape
// puis par ordre si les dates sont identiques
import titreEtapesAscSortByOrdre from './titre-etapes-asc-sort'
import { ITitreDemarcheOrTravaux } from '../../types'

const titreDemarcheOrTravauxAscSort = (
  titreElements: ITitreDemarcheOrTravaux[]
) =>
  titreElements.sort((a, b) => {
    const aHasEtapes = a.etapes && a.etapes.length
    const bHasEtapes = b.etapes && b.etapes.length

    if (!aHasEtapes && bHasEtapes) return 1

    if (aHasEtapes && !bHasEtapes) return -1

    if (!aHasEtapes && !bHasEtapes) {
      return (
        ((a.type && a.type.ordre) || Infinity) -
        ((b.type && b.type.ordre) || Infinity)
      )
    }

    const dateA = titreEtapesAscSortByOrdre(a.etapes!)[0].date
    const dateB = titreEtapesAscSortByOrdre(b.etapes!)[0].date

    // TODO: supprimer les ! sur ordre
    return dateA < dateB ? -1 : dateA > dateB ? 1 : a.ordre! - b.ordre!
  })

export default titreDemarcheOrTravauxAscSort
