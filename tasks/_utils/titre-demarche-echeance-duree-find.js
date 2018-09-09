const dateFormat = require('./date-format')
const titreEtapesSortAsc = require('./titre-etapes-sort-asc')

// entrée:
// - les démarches d'un titre
// - l'ordre d'une démarche dont on cherche la date d'échéance et la durée
// sortie
// - la date d'échéance de la démarche
// - la durée cumulée depuis la date d'échéance précédemment enregistré dans la bdd
const titreDemarcheEcheanceAndDureeFind = (demarches, ordre) =>
  demarches
    // liste les démarches précédentes dont le statut est acceptée ou terminée
    .filter(
      td => ['acc', 'ter'].includes(td.demarcheStatutId) && ordre >= td.ordre
    )
    // parcourt les démarches
    .reduce(
      ({ duree, echeance }, demarche) => {
        // l'échéance est déja définie -> retourne l'accumulateur tel quel
        if (echeance) {
          return { duree, echeance }
        } else if (
          // la démarche est un octroi
          demarche.demarcheId === 'oct'
        ) {
          return demarcheOctroiEcheanceFind(duree, demarche)
        } else if (
          // la démarche est une abrogation, retrait ou renonciation
          ['abr', 'ret', 'ren'].includes(demarche.demarcheId)
        ) {
          // trouve la date d'échéance d'une démarche d'annulation
          return demarcheAnnulationEcheanceFind(demarche)
        } else {
          // trouve soit la date d'échéance
          // soit la durée d'une démarche
          return demarcheEcheanceAndDureeFind(duree, demarche.etapes)
        }
      },
      // l'accumulateur contient initialement
      // - la durée cumulée égale à 0
      // - la date d'échéance (null)
      { duree: 0, echeance: null }
    )

// trouve la date d'échéance et la durée d'une démarche d'octroi
const demarcheOctroiEcheanceFind = (dureeAcc, demarche) => {
  // retourne la durée cumulée et la date d'échéance
  // de la démarche d'octroi
  const demarcheEcheanceAndDuree = demarcheEcheanceAndDureeFind(
    dureeAcc,
    demarche.etapes
  )

  const duree = demarcheEcheanceAndDuree.duree
  let echeance

  if (demarcheEcheanceAndDuree.echeance) {
    // si la démarche contient une date d'échéance
    echeance = demarcheEcheanceAndDuree.echeance
  } else if (duree === 0) {
    // si il n'ya ni date d'échéance, ni durée cumulée,
    // l'échéance par défaut est fixée au 31 décembre 2018
    echeance = '2018-12-31'
  } else {
    // sinon, la date d'échéance est calculé
    // en ajoutant la durée cumulée à la date de la première dpu
    const etapeDpu = titreEtapesSortAsc(demarche).filter(
      te => te.etapeId === 'dpu'
    )[0]
    echeance = etapeDpu ? dateAddYears(etapeDpu.date, duree) : 0
  }

  return {
    duree,
    echeance
  }
}

// trouve la date d'échéance d'une démarche d'annulation
const demarcheAnnulationEcheanceFind = demarche => {
  // la première étape de décision expresse (dex)
  const etapeDex = titreEtapesSortAsc(demarche).filter(
    te => te.etapeId === 'dex'
  )[0]

  // l'échéance est la date de l'étape
  return {
    duree: 0,
    echeance: etapeDex && dateFormat(etapeDex.date)
  }
}

// entrée:
// - les étapes d'une démarche
// - la durée cumulée
// retourne
// - echeance: la date d'échéance de la démarche si définie, sinon null
// - duree: la durée cumulée
const demarcheEcheanceAndDureeFind = (dureeAcc, etapes) =>
  etapes
    // filtre les étapes dont l'id est publication au jorf
    .filter(etape => etape.etapeId === 'dex')
    // parcourt les étapes
    .reduce(
      ({ duree, echeance }, etape) =>
        // si la date d'échéance n'est pas définie
        // et que l'étape contient soit une duree
        // soit une date d'échéance
        !echeance && (etape.duree || etape.echeance)
          ? // soit ajoute la durée de l'étape à la durée cumulée
            // soit trouve la date d'échéance
            {
              duree: etape.duree ? etape.duree + duree : duree,
              echeance: etape.echeance
                ? dateAddYears(etape.echeance, duree)
                : null
            }
          : // sinon, retourne l'accumulateur
            { duree, echeance },
      // l'accumulateur contient initialement
      // - la durée cumulée
      // - une date d'échéance (null)
      { duree: dureeAcc, echeance: null }
    )

// ajoute une durée en années à une date au format YYYY-MM-DD
const dateAddYears = (date, years) => {
  const d = dateFormat(date)
  return `${Number(d.slice(0, 4)) + years}-${d.slice(5)}`
}

module.exports = titreDemarcheEcheanceAndDureeFind
