const dateFormat = require('./date-format')
const titreEtapesSortAsc = require('./titre-etapes-sort-asc')
const titreEtapesSortDesc = require('./titre-etapes-sort-desc')

// entrée:
// - les démarches d'un titre
// - l'ordre d'une démarche dont on cherche la date de fin et la durée
// sortie
// - la date de fin de la démarche
// - la durée cumulée depuis la date de fin précédemment enregistré dans la bdd
const titreDemarcheDateFinAndDureeFind = (titreDemarches, ordre) =>
  titreDemarches
    // liste les démarches précédentes dont le statut est acceptée ou terminée
    .filter(
      titreDemarche =>
        (titreDemarche.demarcheStatutId === 'acc' ||
          titreDemarche.demarcheStatutId === 'ter') &&
        ordre >= titreDemarche.ordre
    )
    // parcourt les démarches
    .reduce(
      ({ duree, dateFin }, titreDemarche) => {
        // console.log(titreDemarches.map(d => d.id))
        // la date de fin est déja définie -> retourne l'accumulateur tel quel
        if (dateFin) {
          return { duree, dateFin }
        } else if (
          // la démarche est un octroi
          titreDemarche.demarcheId === 'oct'
        ) {
          return titreDemarcheOctroiDateFinFind(duree, titreDemarche)
        } else if (
          // la démarche est une abrogation, retrait ou renonciation
          titreDemarche.demarcheId === 'abr' ||
          titreDemarche.demarcheId === 'ret' ||
          (titreDemarche.demarcheId === 'ren' &&
            !titreDemarche.etapes.find(te => te.points))
        ) {
          // trouve la date de fin d'une démarche d'annulation
          return titreDemarcheAnnulationDateFinFind(titreDemarche)
        } else {
          // trouve soit la date de fin
          // soit la durée d'une démarche
          return titreDemarcheNormaleDateFinAndDureeFind(
            duree,
            titreDemarche.etapes
          )
        }
      },
      // l'accumulateur contient initialement
      // - la durée cumulée égale à 0
      // - la date de fin (null)
      { duree: 0, dateFin: null }
    )

// trouve la date de fin et la durée d'une démarche d'octroi
const titreDemarcheOctroiDateFinFind = (dureeAcc, titreDemarche) => {
  // retourne la durée cumulée et la date de fin
  // de la démarche d'octroi
  const { duree, dateFin } = titreDemarcheNormaleDateFinAndDureeFind(
    dureeAcc,
    titreDemarche.etapes
  )

  // retourne une étape de dpu si celle-ci a une date de début
  const titreEtapeDpuHasDateDebut = titreEtapesSortDesc(titreDemarche)
    .filter(te => te.etapeId === 'dpu')
    .find(te => te.dateDebut)

  let dateFinUpdated

  if (dateFin) {
    // si la démarche contient une date de fin
    dateFinUpdated = dateFin
  } else if (duree === 0) {
    // si il n'y a ni date de fin, ni de durée cumulée,
    // la date de fin par défaut est fixée au 31 décembre 2018
    dateFinUpdated = '2018-12-31'
  } else if (titreEtapeDpuHasDateDebut) {
    // si il n'y a ni date de fin, ni durée cumulée,
    // la date de fin par défaut est fixée au 31 décembre 2018
    dateFinUpdated = dateAddYears(titreEtapeDpuHasDateDebut.dateDebut, duree)
  } else {
    // sinon, la date de fin est calculé
    // en ajoutant la durée cumulée à la date de la première dpu ou ens
    const titreEtapeDpuFirst = titreEtapesSortAsc(titreDemarche).find(
      titreEtape => titreEtape.etapeId === 'dpu'
    )
    dateFinUpdated = titreEtapeDpuFirst
      ? dateAddYears(titreEtapeDpuFirst.date, duree)
      : 0
  }

  return {
    duree,
    dateFin: dateFinUpdated
  }
}

// trouve la date de fin d'une démarche d'annulation
const titreDemarcheAnnulationDateFinFind = titreDemarche => {
  let dateFin

  // la dernière étape dex qui contient une date de fin
  const etapeDexHasDateFin = titreEtapesSortDesc(titreDemarche)
    .filter(te => te.etapeId === 'dex')
    .find(te => te.dateFin)

  if (etapeDexHasDateFin) {
    // si la démarche contient une date de fin
    dateFin = dateFormat(etapeDexHasDateFin)
  } else {
    // la première étape de décision expresse (dex)
    const etapeDex = titreEtapesSortAsc(titreDemarche).find(
      te => te.etapeId === 'dex'
    )

    dateFin = dateFormat(etapeDex.date)
  }

  // la date de fin est la date de l'étape
  return {
    duree: 0,
    dateFin
  }
}

// entrées:
// - les étapes d'une démarche
// - la durée cumulée
// retourne
// - dateFin: la date de fin de la démarche si définie, sinon null
// - duree: la durée cumulée
const titreDemarcheNormaleDateFinAndDureeFind = (dureeAcc, titreEtapes) =>
  titreEtapes
    // filtre les étapes dont l'id est publication au jorf
    .filter(titreEtape => titreEtape.etapeId === 'dex')
    // parcourt les étapes
    .reduce(
      ({ duree, dateFin }, titreEtape) => {
        // si
        // - la date de fin n'est pas définie
        // - l'étape contient une duree ou une date de fin
        return !dateFin && (titreEtape.duree || titreEtape.dateFin)
          ? // soit ajoute la durée de l'étape à la durée cumulée
            // soit trouve la date de fin
            {
              duree: titreEtape.duree ? titreEtape.duree + duree : duree,
              dateFin: titreEtape.dateFin
                ? dateAddYears(titreEtape.dateFin, duree)
                : null
            }
          : // sinon, retourne l'accumulateur
            { duree, dateFin }
      },
      // l'accumulateur contient initialement
      // - la durée cumulée
      // - une date de fin (null)
      { duree: dureeAcc, dateFin: null }
    )

// ajoute une durée en années à une date au format YYYY-MM-DD
const dateAddYears = (date, years) => {
  const d = dateFormat(date)
  return `${Number(d.slice(0, 4)) + years}-${d.slice(5)}`
}

module.exports = titreDemarcheDateFinAndDureeFind
