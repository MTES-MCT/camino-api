// retourne l'id de la dernière étape acceptée
// de la dernière démarche acceptée
// pour laquelle la propriété existe
import { ITitres, ITitresDemarches } from '../../types'
import titreDemarchesAscSort from '../utils/titre-demarches-asc-sort'
import titreEtapesDescSort from '../utils/titre-etapes-desc-sort'

interface ITitresEtapesIndex {
  [key: string]: any
}

const titrePropEtapeIdFind = (
  {
    demarches: titreDemarches,
    statutId: titreStatutId
  }: { demarches: ITitresDemarches[]; statutId: string },
  prop: string
) =>
  titreDemarchesAscSort(titreDemarches)
    .reverse()
    // parcourt les démarches
    .reduce((etapeId: string, titreDemarche: ITitresDemarches) => {
      // si une étape a déjà été trouvée
      if (etapeId) return etapeId

      if (
        !(
          // filtre les démarches non acceptée, non terminée ou non en instruction
          (
            ['acc', 'ter'].includes(titreDemarche.statutId!) ||
            // sauf si la démarche est un octroi
            ['oct', 'vut', 'vct'].includes(titreDemarche.typeId) ||
            // ou que le titre a le statut modification en instance
            (titreStatutId === 'mod' &&
              // et que la démarches est une prolongation ou une demande de titre
              ['pro', 'pr1', 'pr2', 'prr', 'vct'].includes(
                titreDemarche.typeId
              ) &&
              // et que plus aucune phase n'est valide
              !titreDemarches.find(
                td => td.phase && td.phase.statutId === 'val'
              ))
          )
        )
      ) {
        return etapeId
      }

      const etape = titreEtapesDescSort(titreDemarche.etapes).find(
        (titreEtape: ITitresEtapesIndex) => {
          // trouve une étape qui contient la propriété
          const isPropFound =
            titreEtape[prop] &&
            (!Array.isArray(titreEtape[prop]) ||
              // la propriété ne doit pas être vide si c'est un tableau
              titreEtape[prop].length)
          if (!isPropFound) return false

          // filtre les étapes acceptation, fait ou favorable
          const isEtapeValide =
            ['acc', 'fai', 'fav'].includes(titreEtape.statutId) &&
            // Si la démarche est un octroi (demande initiale)
            // on prend en compte n'importe quelle étape
            (['oct', 'vut', 'vct'].includes(titreDemarche.typeId) ||
              // ou si on cherche le périmètre
              // et que le titre est en modification en instance
              (prop.match('point') && titreStatutId === 'mod') ||
              // sinon, on ne prend en compte que les étapes de décision
              ['dpu', 'rpu', 'dex', 'dim', 'def', 'sco', 'aco'].includes(
                titreEtape.typeId
              ))
          if (!isEtapeValide) return false

          if (prop.match('amodiataires')) {
            const { dateFin } = titreEtape

            // si la date de fin de l'étape est passée
            // l'amodiataire n'est plus valide
            if (dateFin && new Date(dateFin) < new Date()) return false

            // sinon, si le titre a le statut modification en instance
            // l'amodiataire est encore valide (survie provisoire)
            // ou, si le titre a le statut échu
            // on affiche le dernier amodiataire
            return ['mod', 'ech'].includes(titreStatutId)
          }

          return true
        }
      )

      // si l'étape existe, retourne son id
      // sinon retourne `null`
      return (etape && etape.id) || null
    }, null)

export default titrePropEtapeIdFind
