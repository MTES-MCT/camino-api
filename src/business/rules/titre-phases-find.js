import * as dateFormat from 'dateformat'
import titreDemarcheDateFinAndDureeFind from './titre-demarche-date-fin-duree-find'
import titreDemarchePhasesFilter from './titre-demarche-phases-filter'
import titreEtapesDescSort from '../utils/titre-etapes-desc-sort'
import titreEtapesAscSort from '../utils/titre-etapes-asc-sort'
import titreEtapePublicationFilter from './titre-etape-publication-filter'

// retourne un tableau contenant les phases d'un titre
const titrePhasesFind = (titreDemarches, titreTypeId) => {
  // filtre les démarches qui donnent lieu à des phases
  const titreDemarchesFiltered = titreDemarches.filter(titreDemarche =>
    titreDemarchePhasesFilter(titreDemarche, titreTypeId)
  )

  return titreDemarchesFiltered.reduce((titrePhases, titreDemarche, index) => {
    const dateFin = titrePhaseDateFinFind(
      titreDemarches,
      titreDemarchesFiltered,
      titreDemarche
    )

    const dateDebut = titrePhaseDateDebutFind(
      titreDemarche,
      titrePhases,
      index,
      titreTypeId
    )

    // si
    // - la date du jour est plus récente que la date de fin
    // le statut est valide
    // sinon,
    // - le statut est échu
    const statutId =
      dateFormat(new Date(), 'yyyy-mm-dd') > dateFin ? 'ech' : 'val'

    titrePhases.push({
      titreDemarcheId: titreDemarche.id,
      dateFin,
      dateDebut,
      statutId
    })

    return titrePhases
  }, [])
}

const titrePhaseDateDebutFind = (
  titreDemarche,
  titrePhases,
  index,
  titreTypeId
) => {
  // si
  // - la démarche est un octroi
  if (['oct', 'vut', 'vct'].includes(titreDemarche.typeId)) {
    // retourne une étape de publication si celle-ci possède une date de début
    const etapePublicationHasDateDebut = titreEtapesDescSort(
      titreDemarche.etapes
    ).find(
      titreEtape =>
        titreEtapePublicationFilter(titreEtape, titreTypeId) &&
        titreEtape.dateDebut
    )

    if (etapePublicationHasDateDebut) {
      // la date de début est égale à la date de début de l'étape de publication
      return dateFormat(etapePublicationHasDateDebut.dateDebut, 'yyyy-mm-dd')
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
  const titreEtapePublicationFirst = titreEtapesAscSort(
    titreDemarche.etapes
  ).find(te => titreEtapePublicationFilter(te, titreTypeId))

  // sinon la date de début est égale à la date de la première étape de publication
  return dateFormat(titreEtapePublicationFirst.date, 'yyyy-mm-dd')
}

// trouve la date de fin d'une phase
// in:
// - titreDemarches: toutes les démarches du titre,
//   utile pour trouver la date de fin en cas d'annulation
// - titreDemarchesFiltered: uniquement les démarches
//   d'un titre qui donnent lieu à des phases
// - titreDemarche: la démarche dont on cherche la date de fin

const titrePhaseDateFinFind = (
  titreDemarches,
  titreDemarchesFiltered,
  titreDemarche
) => {
  // trouve une démarche d'annulation si elle existe
  const titreDemarcheAnnulation = demarcheAnnulationFind(
    titreDemarches,
    titreDemarche.annulationTitreDemarcheId
  )

  // si il y a une démarche d'annulation
  // retourne sa date de fin
  if (titreDemarcheAnnulation) {
    return titreDemarcheDateFinAndDureeFind(
      titreDemarches.slice().reverse(),
      titreDemarcheAnnulation.ordre
    ).dateFin
  }

  // sinon, calcule la date de fin en fonction des démarches
  return titreDemarcheDateFinAndDureeFind(
    titreDemarchesFiltered.slice().reverse(),
    titreDemarche.ordre
  ).dateFin
}

const demarcheAnnulationFind = (titreDemarches, annulationTitreDemarcheId) => {
  if (!annulationTitreDemarcheId) {
    return null
  }

  return titreDemarches.find(t => t.id === annulationTitreDemarcheId)
}

export default titrePhasesFind
