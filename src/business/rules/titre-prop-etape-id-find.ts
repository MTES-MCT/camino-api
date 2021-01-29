// retourne l'id de la dernière étape acceptée
// de la dernière démarche acceptée
// pour laquelle la propriété existe

import {
  ITitreDemarche,
  ITitreEtape,
  ITitreEtapeProp,
  IContenuId
} from '../../types'
import titreDemarchesSortAsc from '../utils/titre-elements-sort-asc'
import titreEtapesSortDesc from '../utils/titre-etapes-sort-desc'

const etapeAmodiataireFind = (
  titreEtape: ITitreEtape,
  titreDemarches: ITitreDemarche[]
) => {
  const titreDemarche = titreDemarches.find(
    td => td.id === titreEtape.titreDemarcheId
  )

  if (titreDemarche!.phase?.statutId === 'val') {
    return true
  }

  const titreDemarchePrevious = titreDemarches.find(td => !!td.phase)

  if (titreDemarchePrevious?.phase?.statutId === 'val') {
    return true
  }

  return false
}

// - si l'étape est acceptée, fait ou favorable
// - et
//   - si la démarche est un octroi, une demande de titre d'exploitation ou une mutation partielle
//    - ou si il s'agit d'une étape de décision
//    - ou si le titre est en modification en instance
//      - et que la prop est points, surface, substances ou  communes

const etapeValideCheck = (
  titreEtape: ITitreEtape,
  titreDemarcheTypeId: string,
  titreStatutId?: string,
  prop?: ITitreEtapeProp
) =>
  ['acc', 'fai', 'fav'].includes(titreEtape.statutId) &&
  (['oct', 'vut', 'vct'].includes(titreDemarcheTypeId) ||
    ['dpu', 'dup', 'rpu', 'dex', 'dux', 'dim', 'def', 'sco', 'aco'].includes(
      titreEtape.typeId
    ) ||
    (prop &&
      titreStatutId &&
      ['points', 'surface', 'substances', 'communes'].includes(prop) &&
      titreStatutId === 'mod'))

const etapePropFind = (
  prop: ITitreEtapeProp,
  titreDemarcheEtapes: ITitreEtape[],
  titreDemarcheTypeId: string,
  titreStatutId: string,
  titreDemarches: ITitreDemarche[]
) =>
  titreEtapesSortDesc(titreDemarcheEtapes).find((titreEtape: ITitreEtape) => {
    const isEtapeValide = etapeValideCheck(
      titreEtape,
      titreDemarcheTypeId,
      titreStatutId,
      prop
    )

    if (!isEtapeValide) return false

    // trouve une étape qui contient la propriété
    const isPropFound =
      titreEtape[prop] &&
      (!Array.isArray(titreEtape[prop]) ||
        // la propriété ne doit pas être vide si c'est un tableau
        (titreEtape[prop] as []).length)

    if (!isPropFound) return false

    if (prop === 'amodiataires') {
      return etapeAmodiataireFind(titreEtape, titreDemarches)
    }

    return true
  })

// retourne la première étape valide qui contient l'élément dans la section
const etapeContenuFind = (
  { sectionId, elementId }: IContenuId,
  titreDemarcheEtapes: ITitreEtape[],
  titreDemarcheTypeId: string
) =>
  titreEtapesSortDesc(titreDemarcheEtapes).find(
    titreEtape =>
      etapeValideCheck(titreEtape, titreDemarcheTypeId) &&
      // détermine si l'étape contient la section et l'élément
      titreEtape.contenu &&
      titreEtape.contenu[sectionId] &&
      titreEtape.contenu[sectionId][elementId] !== undefined
  )

// si
// - la démarches est acceptée, terminée
// - ou la démarche est un octroi
// - ou le titre a le statut modification en instance
//   - et la démarche est une prolongation ou une demande de titre
//   - et la démarche n'a aucune phase valide
const demarcheEligibleCheck = (
  titreDemarcheStatutId: string,
  titreDemarcheTypeId: string,
  titreStatutId: string,
  titreDemarches: ITitreDemarche[]
) =>
  ['acc', 'ter'].includes(titreDemarcheStatutId) ||
  ['oct', 'vut', 'vct'].includes(titreDemarcheTypeId) ||
  (titreStatutId === 'mod' &&
    ['pro', 'pr1', 'pr2', 'prr', 'vct'].includes(titreDemarcheTypeId) &&
    !titreDemarches.find(td => td.phase && td.phase.statutId === 'val'))

/**
 * Trouve l'id de l'étape de référence pour une propriété
 * @param prop - nom de la propriété
 * @param titreDemarches - démarches du titre
 * @param titreStatutId - statut du titre
 * @returns id d'une etape
 */

const titrePropEtapeIdFind = (
  prop: ITitreEtapeProp,
  titreDemarches: ITitreDemarche[],
  titreStatutId: string
) => {
  const titreDemarchesSorted = titreDemarchesSortAsc(titreDemarches).reverse()

  return titreDemarchesSorted.reduce(
    (etapeId: string | null, titreDemarche: ITitreDemarche) => {
      // si une étape a déjà été trouvée
      if (etapeId) return etapeId

      // si la démarche n'est pas éligible
      if (
        !demarcheEligibleCheck(
          titreDemarche.statutId!,
          titreDemarche.typeId,
          titreStatutId,
          titreDemarches
        )
      ) {
        return null
      }

      const etape = etapePropFind(
        prop,
        titreDemarche.etapes!,
        titreDemarche.typeId,
        titreStatutId,
        titreDemarchesSorted
      )

      // si l'étape existe,
      // retourne son id
      // sinon retourne `null`

      if (!etape) return null

      return etape.id
    },
    null
  )
}

/**
 * Trouve l'id de l'étape de référence pour un contenu
 * @param sectionIds - id de la section et de l'élément du contenu
 * @param titreDemarches - démarches du titre
 * @param titreStatutId - statut du titre
 * @returns id d'une etape
 */

const titreContenuEtapeIdFind = (
  { sectionId, elementId }: IContenuId,
  titreDemarches: ITitreDemarche[],
  titreStatutId: string
) => {
  const titreDemarchesSorted = titreDemarchesSortAsc(titreDemarches).reverse()

  return titreDemarchesSorted.reduce(
    (etapeId: string | null, titreDemarche: ITitreDemarche) => {
      // si une étape a déjà été trouvée
      if (etapeId) return etapeId

      if (
        !demarcheEligibleCheck(
          titreDemarche.statutId!,
          titreDemarche.typeId,
          titreStatutId,
          titreDemarches
        )
      ) {
        return null
      }

      const etape = etapeContenuFind(
        { sectionId, elementId },
        titreDemarche.etapes!,
        titreDemarche.typeId
      )

      if (!etape) return null

      return etape.id
    },
    null
  )
}

export { titrePropEtapeIdFind, titreContenuEtapeIdFind }
