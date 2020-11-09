// retourne l'id de la dernière étape acceptée
// de la dernière démarche acceptée
// pour laquelle la propriété existe

import { ITitreDemarche, ITitreEtape, TitreEtapeProp } from '../../types'
import titreDemarchesAscSort from '../utils/titre-elements-asc-sort'
import titreEtapesDescSort from '../utils/titre-etapes-desc-sort'

const etapeValideCheck = (
  titreEtape: ITitreEtape,
  titreDemarcheTypeId: string,
  titreStatutId: string,
  prop: TitreEtapeProp
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
  titreDemarcheEtapes: ITitreEtape[],
  titreDemarcheTypeId: string,
  titreStatutId: string,
  prop: TitreEtapeProp
) =>
  titreEtapesDescSort(titreDemarcheEtapes).find((titreEtape: ITitreEtape) => {
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
  titreDemarches: ITitreDemarche[],
  titreStatutId: string,
  prop: TitreEtapeProp
) =>
  (titreDemarchesAscSort(titreDemarches) as ITitreDemarche[])
    .reverse()
    .reduce((etapeId: string | null, titreDemarche: ITitreDemarche) => {
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
        return etapeId
      }

      const etape = etapePropFind(
        titreDemarche.etapes!,
        titreDemarche.typeId,
        titreStatutId,
        prop
      )

      // si l'étape existe,
      // retourne son id
      // sinon retourne `null`
      return (etape && etape.id) || null
    }, null)

export default titrePropEtapeIdFind
