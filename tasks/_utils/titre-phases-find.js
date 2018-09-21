const titreDemarcheDateFinAndDureeFind = require('./titre-demarche-date-fin-duree-find')
const titreEtapesSortDesc = require('./titre-etapes-sort-desc')
const titreEtapesSortAsc = require('./titre-etapes-sort-asc')
const dateFormat = require('dateformat')

// retourne un tableau contenant les phases d'un titre
const titrePhasesFind = titreDemarchesByTitre =>
  titreDemarchesByTitre.reduce((titrePhases, titreDemarche, index) => {
    let dateFin = titreDemarcheDateFinAndDureeFind(
      titreDemarchesByTitre.slice().reverse(),
      titreDemarche.ordre
    ).dateFin

    const dateDebut = titrePhaseDateDebutFind(titreDemarche, titrePhases, index)

    // si
    // - la date du jour est plus récente que la date de fin
    // le statut est valide
    // sinon,
    // - le statut est échu
    const phaseStatutId =
      dateFormat(new Date(), 'yyyy-mm-dd') > dateFin ? 'ech' : 'val'

    return [
      ...titrePhases,
      {
        titreDemarcheId: titreDemarche.id,
        dateFin,
        dateDebut,
        phaseStatutId
      }
    ]
  }, [])

const titrePhaseDateDebutFind = (titreDemarche, titrePhases, index) => {
  // retourne la phase précédente
  const phasePrevious = titrePhases[index - 1]

  // retourne une étape de dpu si celle-ci possède une date de début
  const etapeDpuHasDateDebut = titreEtapesSortDesc(titreDemarche)
    .filter(te => te.etapeId === 'dpu')
    .find(te => te.dateDebut)

  let dateDebut

  if (
    // si
    // - la démarche est un octroi
    // - cette démarche a une étape dpu qui possède une date de début
    titreDemarche.demarcheId === 'oct' &&
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
      titreEtape => titreEtape.etapeId === 'dpu'
    )

    dateDebut =
      titreEtapeDpuFirst && dateFormat(titreEtapeDpuFirst.date, 'yyyy-mm-dd')
  }

  return dateDebut
}

module.exports = titrePhasesFind
