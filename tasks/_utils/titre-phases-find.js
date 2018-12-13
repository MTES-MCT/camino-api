const dateFormat = require('dateformat')
const titreDemarcheDateFinAndDureeFind = require('./titre-demarche-date-fin-duree-find')
const titreDemarchePhasesFilter = require('./titre-demarche-phases-filter')
const titreEtapesSortDesc = require('./titre-etapes-sort-desc')
const titreEtapesSortAsc = require('./titre-etapes-sort-asc')

// retourne un tableau contenant les phases d'un titre
const titrePhasesFind = (titreDemarchesByTitre, titreIsAxm) => {
  // filtre les démarches qui donnent lieu à des phases
  const titreDemarchesByTitreFiltered = titreDemarchesByTitre.filter(
    titreDemarche => titreDemarchePhasesFilter(titreDemarche, titreIsAxm)
  )

  return titreDemarchesByTitreFiltered.reduce(
    (titrePhases, titreDemarche, index) => {
      const dateFin = titrePhaseDateFinFind(
        titreDemarchesByTitre,
        titreDemarchesByTitreFiltered,
        titreDemarche.ordre
      )

      const dateDebut = titrePhaseDateDebutFind(
        titreDemarche,
        titrePhases,
        index,
        titreIsAxm
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
    },
    []
  )
}

const titrePhaseDateDebutFind = (
  titreDemarche,
  titrePhases,
  index,
  titreIsAxm
) => {
  // retourne la phase précédente
  const phasePrevious = titrePhases[index - 1]

  // retourne une étape de dpu si celle-ci possède une date de début
  const etapeDpuHasDateDebut = titreEtapesSortDesc(titreDemarche)
    .filter(
      titreEtape =>
        titreEtape.typeId === 'dpu' ||
        (titreIsAxm && titreEtape.typeId === 'dex')
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
  const titreEtapeDpuFirst = titreEtapesSortAsc(titreDemarche).find(
    titreEtape =>
      titreEtape.typeId === 'dpu' || (titreIsAxm && titreEtape.typeId === 'dex')
  )

  return titreEtapeDpuFirst && dateFormat(titreEtapeDpuFirst.date, 'yyyy-mm-dd')
}

// trouve la date de fin d'une phase
// in:
// - titreDemarchesByTitre: toutes les démarches du titre,
//   utile pour trouver la date de fin en cas d'annulation
// - titreDemarchesByTitreFiltered: uniquement les démarches
//   d'un titre qui donnent lieu à des phases
// - ordre: le numéro d'ordre de la démarche dont on cherche la date de fin

const titrePhaseDateFinFind = (
  titreDemarchesByTitre,
  titreDemarchesByTitreFiltered,
  ordre
) => {
  return titreDemarcheDateFinAndDureeFind(
    titreDemarchesByTitreFiltered.slice().reverse(),
    ordre
  ).dateFin
}

module.exports = titrePhasesFind
