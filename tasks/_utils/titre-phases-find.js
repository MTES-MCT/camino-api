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
      const dateFin = titreDemarcheDateFinAndDureeFind(
        titreDemarchesByTitreFiltered.slice().reverse(),
        titreDemarche.ordre
      ).dateFin

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

      // const test = titreDemarchePhasesFilter(titreDemarche, titreIsAxm)

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

  let dateDebut

  if (
    // si
    // - la démarche est un octroi
    // - cette démarche a une étape dpu qui possède une date de début
    titreDemarche.typeId === 'oct' &&
    etapeDpuHasDateDebut
  ) {
    // la date de début est égale à la date de début de la dpu
    dateDebut = dateFormat(etapeDpuHasDateDebut.dateDebut, 'yyyy-mm-dd')
  } else if (
    // il y a une phase précédente
    phasePrevious
  ) {
    // la date de début est égale à la date de fin de l'étape précédente
    dateDebut = phasePrevious.dateFin
  } else {
    // sinon, la date de début est égale à la date de la première étape de dpu
    const titreEtapeDpuFirst = titreEtapesSortAsc(titreDemarche).find(
      titreEtape =>
        titreEtape.typeId === 'dpu' ||
        (titreIsAxm && titreEtape.typeId === 'dex')
    )

    dateDebut =
      titreEtapeDpuFirst && dateFormat(titreEtapeDpuFirst.date, 'yyyy-mm-dd')
  }

  return dateDebut
}

module.exports = titrePhasesFind
