import { ITitreDemarche, ITitrePhase } from '../../types'

import * as dateFormat from 'dateformat'
import titreDemarcheDateFinAndDureeFind from './titre-demarche-date-fin-duree-find'
import titreDemarchePhasesFilter from './titre-demarche-phases-filter'
import titreEtapesSortDesc from '../utils/titre-etapes-sort-desc'
import titreEtapesSortAsc from '../utils/titre-etapes-sort-asc'
import titreEtapePublicationFilter from './titre-etape-publication-filter'

import { titreDemarcheAnnulationDateFinFind } from './titre-demarche-annulation-date-fin-find'

/**
 * trouve une démarche acceptée ou terminée qui est
 * - un retrait
 * - ou une renonciation
 *   - et ce n'est pas une renonciation partielle
 *   (= ne contient pas d'étape avec des infos géo (points)
 * @param titreDemarches - liste d’étapes
 */
const titreDemarcheAnnulationFind = (titreDemarches: ITitreDemarche[]) =>
  titreDemarches.find(
    titreDemarche =>
      ['acc', 'ter'].includes(titreDemarche.statutId!) &&
      (titreDemarche.typeId === 'ret' ||
        (titreDemarche.typeId === 'ren' &&
          !titreDemarche.etapes!.find(te => te.points?.length)))
  )

// retourne un tableau contenant les phases d'un titre
const titrePhasesFind = (
  titreDemarches: ITitreDemarche[],
  titreTypeId?: string
) => {
  // filtre les démarches qui donnent lieu à des phases
  const titreDemarchesFiltered = titreDemarches.filter(titreDemarche =>
    titreDemarchePhasesFilter(titreDemarche, titreTypeId)
  )

  const titreDemarcheAnnulation = titreDemarcheAnnulationFind(titreDemarches)
  const titreDemarcheAnnulationDate =
    titreDemarcheAnnulation?.etapes?.length &&
    titreDemarcheAnnulationDateFinFind(titreDemarcheAnnulation.etapes)

  return titreDemarchesFiltered.reduce(
    (titrePhases: ITitrePhase[], titreDemarche, index) => {
      let dateFin = titrePhaseDateFinFind(
        titreDemarches,
        titreDemarchesFiltered,
        titreDemarche
      ) as string

      // si le titre contient une démarche d'annulation valide
      // et la date de fin de la phase est postérieure à la date d'annulation
      // alors la date de fin de la phase est la date d'annulation
      if (
        titreDemarcheAnnulationDate &&
        titreDemarcheAnnulationDate < dateFin
      ) {
        dateFin = titreDemarcheAnnulationDate
      }

      const dateDebut = titrePhaseDateDebutFind(
        titreDemarche,
        titrePhases,
        index,
        titreTypeId
      ) as string

      // dateFin et dateDebut ne seront jamais `null`
      // car les démarches sont pré-filtrées

      const aujourdhui = dateFormat(new Date(), 'yyyy-mm-dd')

      // si
      // - la date du jour est plus récente que la date de fin
      // le statut est valide
      // sinon,
      // - le statut est échu
      const statutId = dateFin < aujourdhui ? 'ech' : 'val'

      // TODO:
      // est ce qu'on doit vérifier si une date de début
      // est postérieure a une date d'annulation avant d'ajouter la phase ?

      titrePhases.push({
        titreDemarcheId: titreDemarche.id,
        dateFin,
        dateDebut,
        statutId
      })

      return titrePhases
    },
    []
  )
}

const titrePhaseDateDebutFind = (
  titreDemarche: ITitreDemarche,
  titrePhases: ITitrePhase[],
  index: number,
  titreTypeId?: string
) => {
  // si
  // - la démarche est un octroi
  if (['oct', 'vut', 'vct'].includes(titreDemarche.typeId)) {
    // retourne une étape de publication si celle-ci possède une date de début
    const etapePublicationHasDateDebut = titreEtapesSortDesc(
      titreDemarche.etapes!
    ).find(
      titreEtape =>
        titreEtapePublicationFilter(titreEtape.typeId, titreTypeId) &&
        titreEtape.dateDebut
    )

    if (etapePublicationHasDateDebut?.dateDebut) {
      // la date de début est égale à la date de début de l'étape de publication
      return etapePublicationHasDateDebut.dateDebut
    }
  }

  // retourne la phase précédente
  const phasePrevious = titrePhases[index - 1]

  // si il y a une phase précédente
  if (phasePrevious) {
    // la date de début est égale à la date de fin de l'étape précédente
    return phasePrevious.dateFin
  }

  // retourne la première étape de publication de la démarche
  const titreEtapePublicationFirst = titreEtapesSortAsc(
    titreDemarche.etapes!
  ).find(te => titreEtapePublicationFilter(te.typeId, titreTypeId))

  // sinon la date de début est égale à la date de la première étape de publication
  return titreEtapePublicationFirst!.date
}

// trouve la date de fin d'une phase
// in:
// - titreDemarches: toutes les démarches du titre,
//   utile pour trouver la date de fin en cas d'annulation
// - titreDemarchesFiltered: uniquement les démarches
//   d'un titre qui donnent lieu à des phases
// - titreDemarche: la démarche dont on cherche la date de fin

const titrePhaseDateFinFind = (
  titreDemarches: ITitreDemarche[],
  titreDemarchesFiltered: ITitreDemarche[],
  titreDemarche: ITitreDemarche
) =>
  // sinon, calcule la date de fin en fonction des démarches
  titreDemarcheDateFinAndDureeFind(
    titreDemarchesFiltered.slice().reverse(),
    titreDemarche.ordre!
  ).dateFin

export default titrePhasesFind
