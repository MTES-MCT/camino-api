// retourne l'id de la dernière étape acceptée
// de la dernière démarche acceptée
// pour laquelle la propriété existe

import * as dateFormat from 'dateformat'

import { ITitreDemarche, ITitreEtape, TitreEtapeProp } from '../../types'
import titreDemarchesAscSort from '../utils/titre-demarches-asc-sort'
import titreEtapesDescSort from '../utils/titre-etapes-desc-sort'

const etapeAmodiataireFind = (
  titreEtape: ITitreEtape,
  titreStatutId: string
) => {
  const { dateFin } = titreEtape

  const aujourdhui = dateFormat(new Date(), 'yyyy-mm-dd')

  // si la date de fin de l'étape est passée
  // l'amodiataire n'est plus valide
  if (dateFin && dateFin < aujourdhui) return false

  // sinon, si le titre a le statut modification en instance
  // l'amodiataire est encore valide (survie provisoire)
  // ou, si le titre a le statut échu
  // on affiche le dernier amodiataire
  return ['mod', 'ech'].includes(titreStatutId)
}

const etapeValideCheck =
  (
    titreEtape: ITitreEtape,
    titreDemarcheTypeId: string,
    titreStatutId: string,
    prop: TitreEtapeProp
  ) =>
    // filtre les étapes acceptation, fait ou favorable
    // Si la démarche est un octroi (demande initiale)
    // on prend en compte n'importe quelle étape
    // ou si on cherche le périmètre
    // et que le titre est en modification en instance
    // sinon, on ne prend en compte que les étapes de décision
    ['acc', 'fai', 'fav'].includes(titreEtape.statutId) &&
    (['oct', 'vut', 'vct'].includes(titreDemarcheTypeId) ||
      (prop.match('point') && titreStatutId === 'mod') ||
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

    if (prop.match('amodiataires')) {
      return etapeAmodiataireFind(titreEtape, titreStatutId)
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
  titreDemarches: ITitreDemarche[],
  titreStatutId: string,
  prop: TitreEtapeProp
) =>
  titreDemarchesAscSort(titreDemarches)
    .reverse()
    .reduce((
      etapeId: string | null,
      titreDemarche: ITitreDemarche
    ) => {
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
