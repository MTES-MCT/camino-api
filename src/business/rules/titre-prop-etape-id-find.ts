// retourne l'id de la dernière étape acceptée
// de la dernière démarche acceptée
// pour laquelle la propriété existe

import { ITitreDemarche, ITitreEtape, ITitreEtapeProp } from '../../types'

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

const etapeValideCheck = (
  titreEtape: ITitreEtape,
  titreDemarcheTypeId: string,
  titreStatutId: string,
  prop: ITitreEtapeProp
) =>
  // - si l'étape est acceptée, fait ou favorable
  // - et
  //   - si la démarche est un octroi, une demande de titre d'exploitation ou une mutation partielle
  //    - ou si le titre est en modification en instance
  //      - et que la prop est points, surface, substances ou  communes
  //    - ou si il s'agit d'une étape de décision
  ['acc', 'fai', 'fav'].includes(titreEtape.statutId) &&
  (['oct', 'vut', 'vct'].includes(titreDemarcheTypeId) ||
    (['points', 'surface', 'substances', 'communes'].includes(prop) &&
      titreStatutId === 'mod') ||
    ['dpu', 'dup', 'rpu', 'dex', 'dux', 'dim', 'def', 'sco', 'aco'].includes(
      titreEtape.typeId
    ))

const etapePropFind = (
  prop: ITitreEtapeProp,
  titreDemarcheEtapes: ITitreEtape[],
  titreDemarcheTypeId: string,
  titreStatutId: string,
  titreDemarches: ITitreDemarche[]
) =>
  titreDemarcheEtapes.find((titreEtape: ITitreEtape) => {
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
  ['acc', 'ter'].includes(titreDemarcheStatutId!) ||
  ['oct', 'vut', 'vct'].includes(titreDemarcheTypeId) ||
  (titreStatutId === 'mod' &&
    ['pro', 'pr1', 'pr2', 'prr', 'vct'].includes(titreDemarcheTypeId) &&
    !titreDemarches.find(td => td.phase && td.phase.statutId === 'val'))

const titrePropEtapeIdFind = (
  prop: ITitreEtapeProp,
  titreDemarches: ITitreDemarche[],
  titreStatutId: string
) =>
  titreDemarches.reduce(
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
        titreDemarches
      )

      // si l'étape existe,
      // retourne son id
      // sinon retourne `null`
      return (etape && etape.id) || null
    },
    null
  )

export default titrePropEtapeIdFind
