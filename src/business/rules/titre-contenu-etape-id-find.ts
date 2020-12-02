// retourne l'id de la dernière étape acceptée
// de la dernière démarche acceptée
// pour laquelle la propriété existe
import { ITitreDemarche, ITitreEtape } from '../../types'
import titreDemarchesAscSort from '../utils/titre-elements-sort-asc'
import titreEtapesSortDesc from '../utils/titre-etapes-sort-desc'

const etapeValideCheck = (
  titreEtape: ITitreEtape,
  titreDemarcheTypeId: string
) =>
  // filtre les étapes acceptation, fait ou favorable
  // Si la démarche est un octroi (demande initiale)
  // on prend en compte n'importe quelle étape
  // et que le titre est en modification en instance
  // sinon, on ne prend en compte que les étapes de décision
  ['acc', 'fai', 'fav'].includes(titreEtape.statutId) &&
  (['oct', 'vut', 'vct'].includes(titreDemarcheTypeId) ||
    ['dpu', 'dup', 'rpu', 'dex', 'dux', 'dim', 'def', 'sco', 'aco'].includes(
      titreEtape.typeId
    ))

const etapeContenuFind = (
  titreDemarcheEtapes: ITitreEtape[],
  titreDemarcheTypeId: string,
  sectionId: string,
  elementId: string
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
  ['acc', 'ter'].includes(titreDemarcheStatutId!) ||
  ['oct', 'vut', 'vct'].includes(titreDemarcheTypeId) ||
  (titreStatutId === 'mod' &&
    ['pro', 'pr1', 'pr2', 'prr', 'vct'].includes(titreDemarcheTypeId) &&
    !titreDemarches.find(td => td.phase && td.phase.statutId === 'val'))

const titreContenuEtapeIdFind = (
  titreDemarches: ITitreDemarche[],
  titreStatutId: string,
  sectionId: string,
  elementId: string
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

      const etape = etapeContenuFind(
        titreDemarche.etapes!,
        titreDemarche.typeId,
        sectionId,
        elementId
      )

      // si l'étape existe,
      // retourne son id
      // sinon retourne `null`
      return (etape && etape.id) || null
    }, null)

export default titreContenuEtapeIdFind
