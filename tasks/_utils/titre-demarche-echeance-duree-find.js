const dateFormat = require('./date-format')
const titreEtapesSortAsc = require('./titre-etapes-sort-asc')

// entrée:
// - les démarches d'un titre
// - l'ordre d'une démarche dont on cherche la date d'échéance et la durée
// sortie
// - la date d'échéance de la démarche
const titreDemarcheEcheanceDureeFind = (demarches, ordre) =>
  demarches
    // liste les démarches précédentes dont le statut est acceptée ou terminée
    .filter(
      td => ['acc', 'ter'].includes(td.demarcheStatutId) && ordre >= td.ordre
    )
    .reverse()
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
          return demarcheAnnuleeEcheanceFind(demarche)
        } else {
          return demarcheEcheanceAndDureeFind(duree, demarche.etapes)
        }
      },
      // l'accumulateur contient initialement
      // - la durée cumulée égale à 0
      // - la date d'échéance (null)
      { duree: 0, echeance: null }
    )

// trouve la date d'échéance et la durée d'une démarche d'octroi
const demarcheOctroiEcheanceFind = (duree, demarche) => {
  const a = demarcheEcheanceAndDureeFind(duree, demarche.etapes)

  const etapeDpu = titreEtapesSortAsc(demarche).filter(
    te => te.etapeId === 'dpu'
  )[0]

  return a.echeance ? a.echeance : dateAddYears(etapeDpu.date, duree)
}

// trouve la date d'échéance d'une démarche annulée
const demarcheAnnuleeEcheanceFind = demarche => {
  // la première étape de décision expresse (dex)
  const etapeDex = titreEtapesSortAsc(demarche).filter(
    te => te.etapeId === 'dex'
  )[0]

  // l'échéance est la date de l'étape
  return {
    duree: 0,
    echeance: etapeDex && etapeDex.date
  }
}

// entrée:
// - les étapes d'une démarche
// - la durée cumulée
// retourne
// - echeance: la date d'échéance de la démarche si définie, sinon null
// - duree: la durée de la démarche si définie, sinon 0
const demarcheEcheanceAndDureeFind = (duree, etapes) =>
  etapes
    // filtre les étapes dont l'id est publication au jorf
    .filter(etape => etape.etapeId === 'dex')
    // parcourt les étapes
    .reduce(
      ({ duree, echeance }, etape) =>
        // si la date d'échéance et la durée ne sont pas définies
        !echeance && !duree
          ? // trouve la date d'échéance (ou la durée de l'étape)
            {
              duree: etape.duree ? etape.duree + duree : duree,
              echeance: etape.echeance
                ? dateAddYears(etape.echeance, duree)
                : null
            }
          : // sinon, retourne l'accumulateur en l'état
            { duree, echeance },
      // l'accumulateur contient initialement
      // - la durée cumulée
      // - la date d'échéance (null)
      { duree, echeance: null }
    )

// ajoute une durée en années à une date au format YYYY-MM-DD
const dateAddYears = (date, years) => {
  const d = dateFormat(date)
  return `${Number(d.slice(0, 4)) + years}-${d.slice(5)}`
}

module.exports = titreDemarcheEcheanceDureeFind
