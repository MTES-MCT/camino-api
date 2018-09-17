const dateFormat = require('./date-format')
const titreEtapesSortAsc = require('./titre-etapes-sort-asc')
const titreEtapesSortDesc = require('./titre-etapes-sort-desc')

// entrée:
// - les démarches d'un titre
// - l'ordre d'une démarche dont on cherche la date de fin et la durée
// sortie
// - la date de fin de la démarche
// - la durée cumulée depuis la date de fin précédemment enregistré dans la bdd
const titreDemarcheDateFinAndDureeFind = (demarches, ordre) =>
  demarches
    // liste les démarches précédentes dont le statut est acceptée ou terminée
    .filter(
      td =>
        (td.demarcheStatutId === 'acc' || td.demarcheStatutId === 'ter') &&
        ordre >= td.ordre
    )
    // parcourt les démarches
    .reduce(
      ({ duree, dateFin }, td) => {
        // console.log(demarches.map(d => d.id))
        // la date de fin est déja définie -> retourne l'accumulateur tel quel
        if (dateFin) {
          return { duree, dateFin }
        } else if (
          // la démarche est un octroi
          td.demarcheId === 'oct'
        ) {
          return demarcheOctroiDateFinFind(duree, td)
        } else if (
          // la démarche est une abrogation, retrait ou renonciation
          td.demarcheId === 'abr' ||
          td.demarcheId === 'ret' ||
          (td.demarcheId === 'ren' && !td.etapes.find(te => te.points))
        ) {
          // trouve la date de fin d'une démarche d'annulation
          return demarcheAnnulationDateFinFind(td)
        } else {
          // trouve soit la date de fin
          // soit la durée d'une démarche
          return demarcheDateFinAndDureeFind(duree, td.etapes)
        }
      },
      // l'accumulateur contient initialement
      // - la durée cumulée égale à 0
      // - la date de fin (null)
      { duree: 0, dateFin: null }
    )

// trouve la date de fin et la durée d'une démarche d'octroi
const demarcheOctroiDateFinFind = (dureeAcc, demarche) => {
  // retourne la durée cumulée et la date de fin
  // de la démarche d'octroi
  const { duree, dateFin } = demarcheDateFinAndDureeFind(
    dureeAcc,
    demarche.etapes
  )

  // retourne une étape de dpu si celle-ci a une date de début
  const etapeDpuHasDateDebut = titreEtapesSortDesc(demarche)
    .filter(te => te.etapeId === 'dpu')
    .find(te => te.dateDebut)

  let dateFinUpdated

  if (dateFin) {
    // si la démarche contient une date de fin
    dateFinUpdated = dateFin
  } else if (duree === 0) {
    // si il n'ya ni date de fin, ni durée cumulée,
    // la date de fin par défaut est fixée au 31 décembre 2018
    dateFinUpdated = '2018-12-31'
  } else if (etapeDpuHasDateDebut) {
    // si il n'y a ni date de fin, ni durée cumulée,
    // la date de fin par défaut est fixée au 31 décembre 2018
    dateFinUpdated = dateAddYears(etapeDpuHasDateDebut.dateDebut, duree)
  } else {
    // sinon, la date de fin est calculé
    // en ajoutant la durée cumulée à la date de la première dpu ou ens
    const etapeDpu = titreEtapesSortAsc(demarche).find(
      te => te.etapeId === 'dpu'
    )
    dateFinUpdated = etapeDpu ? dateAddYears(etapeDpu.date, duree) : 0
  }

  return {
    duree,
    dateFin: dateFinUpdated
  }
}

// trouve la date de fin d'une démarche d'annulation
const demarcheAnnulationDateFinFind = demarche => {
  let dateFin

  // la dernière étape dex qui contient une date de fin
  const etapeDexHasDateFin = titreEtapesSortDesc(demarche)
    .filter(te => te.etapeId === 'dex')
    .find(te => te.dateFin)

  if (etapeDexHasDateFin) {
    // si la démarche contient une date de fin
    dateFin = dateFormat(etapeDexHasDateFin)
  } else {
    // la première étape de décision expresse (dex)
    const etapeDex = titreEtapesSortAsc(demarche).find(
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

// entrée:
// - les étapes d'une démarche
// - la durée cumulée
// retourne
// - dateFin: la date de fin de la démarche si définie, sinon null
// - duree: la durée cumulée
const demarcheDateFinAndDureeFind = (dureeAcc, etapes) =>
  etapes
    // filtre les étapes dont l'id est publication au jorf
    .filter(etape => etape.etapeId === 'dex')
    // parcourt les étapes
    .reduce(
      ({ duree, dateFin }, etape) =>
        // si la date de fin n'est pas définie
        // et que l'étape contient soit une duree
        // soit une date de fin
        !dateFin && (etape.duree || etape.dateFin)
          ? // soit ajoute la durée de l'étape à la durée cumulée
            // soit trouve la date de fin
            {
              duree: etape.duree ? etape.duree + duree : duree,
              dateFin: etape.dateFin ? dateAddYears(etape.dateFin, duree) : null
            }
          : // sinon, retourne l'accumulateur
            { duree, dateFin },
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
