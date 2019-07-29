import * as dateFormat from 'dateformat'
import titreDemarcheDateFinAndDureeFind from './titre-demarche-date-fin-duree-find'
import titreDemarchePhasesFilter from './titre-demarche-phases-filter'
import titreEtapesDescSort from '../utils/titre-etapes-desc-sort'
import titreEtapesAscSort from '../utils/titre-etapes-asc-sort'

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

    return [
      ...titrePhases,
      {
        titreDemarcheId: titreDemarche.id,
        dateFin,
        dateDebut,
        statutId
      }
    ]
  }, [])
}

const titrePhaseDateDebutFind = (
  titreDemarche,
  titrePhases,
  index,
  titreTypeId
) => {
  // retourne la phase précédente
  const phasePrevious = titrePhases[index - 1]

  // retourne une étape de dpu si celle-ci possède une date de début
  const etapeDpuHasDateDebut = titreEtapesDescSort(titreDemarche.etapes)
    .filter(
      titreEtape =>
        titreEtape.typeId === 'dpu' ||
        (titreTypeId === 'axm' && ['dex', 'rpu'].includes(titreEtape.typeId)) ||
        (titreTypeId === 'prx' && titreEtape.typeId === 'rpu')
    )
    .find(te => te.dateDebut)

  // si
  // - la démarche est un octroi
  // - cette démarche a une étape dpu qui possède une date de début
  if (titreDemarche.typeId === 'oct' && etapeDpuHasDateDebut) {
    // la date de début est égale à la date de début de la dpu
    return dateFormat(etapeDpuHasDateDebut.dateDebut, 'yyyy-mm-dd')
  }

  // si il y a une phase précédente
  if (phasePrevious) {
    // la date de début est égale à la date de fin de l'étape précédente
    return phasePrevious.dateFin
  }

  // sinon, la date de début est égale à la date de la première étape de dpu
  const titreEtapeDpuFirst = titreEtapesAscSort(titreDemarche.etapes).find(
    titreEtape =>
      titreEtape.typeId === 'dpu' ||
      (titreTypeId === 'axm' && ['dex', 'rpu'].includes(titreEtape.typeId)) ||
      (titreTypeId === 'prx' && titreEtape.typeId === 'rpu')
  )

  // si une date de dpu est trouvée, formate la date
  // sinon, retourne null
  return titreEtapeDpuFirst
    ? dateFormat(titreEtapeDpuFirst.date, 'yyyy-mm-dd')
    : null
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
