const dateFormat = require('./date-format')
const titreEtapesSortAsc = require('./titre-etapes-sort-asc')

// ajoute une durée en années à une date au format YYYY-MM-DD
const dateAddYears = (date, years) => {
  const d = dateFormat(date)
  console.log(d, years)
  return `${Number(d.slice(0, 4)) + years}-${d.slice(5)}`
}

// entrée
// - une démarche
// - une étape
// - une durée cumulée
// sortie
// - la date d'échéance du titre
// - la durée cumulée
const titreEtapeEcheanceFind = (titreDemarche, titreEtape, dureeAcc) => {
  // si l’étape contient une durée, elle est ajoutée à la durée cumulée
  const duree = titreEtape.duree ? dureeAcc + titreEtape.duree : dureeAcc

  console.log(titreEtape.id, dureeAcc, duree)

  // les étapes classée dans l'ordre ascendant
  const titreEtapesSortedAsc = titreEtapesSortAsc(titreDemarche)

  let echeance = null

  if (
    // le type de la démarche est abrogation, retrait ou renonciation
    ['abr', 'ret', 'ren'].includes(titreDemarche.demarcheId)
  ) {
    // la première étape de décision expresse (dex)
    const titreEtapeDex = titreEtapesSortedAsc.filter(
      te => te.etapeId === 'dex'
    )[0]

    // la date d’échéance = date de l'étape augmentée de la "durée"
    echeance = titreEtapeDex && dateAddYears(titreEtapeDex.date, duree)
  } else if (
    // la démarche est un octroi
    // ou l’étape contient une date d’échéance
    titreDemarche.demarcheId === 'oct' ||
    titreEtape.echeance
  ) {
    // date de la première étape dpu
    const titreEtapeDpu = titreEtapesSortedAsc.filter(
      te => te.etapeId === 'dpu'
    )[0]

    // date d’échéance = date de l'étape augmentée de la "durée"
    echeance = titreEtapeDpu && dateAddYears(titreEtapeDpu.date, duree)
  }

  return { duree, echeance }
}

// entrée:
// - la démarche d'un titres
// - un accumulateur qui contient:
//   - la durée cumulée des démarches précédentes
//   - la date d'échéance (null)
// retourne
// - la date d'échéance du titre si elle est définie dans l'étape
// - la durée cumulée dans les étapes précédentes
const titreDemarcheEcheanceFind = (titreDemarche, { duree, echeance }) =>
  titreDemarche.etapes
    // filtre les étapes dont l'id est publication au jorf
    .filter(titreEtape => titreEtape.etapeId === 'dex')
    // parcourt les étapes
    .reduce(
      (acc, titreEtape) =>
        // si la date d'échéance n'est pas définie
        !acc.echeance
          ? // trouve la date d'échéance (ou la durée de l'étape)
            titreEtapeEcheanceFind(titreDemarche, titreEtape, acc.duree)
          : // sinon, retourne l'accumulateur en l'état
            acc,
      // 'accumulateur contient initialement
      // - la durée accumulée
      // - la date d'échéance (null)
      { duree, echeance }
    )

// entrée:
// - les démarches d'un titres
// sortie:
// - la date d'échéance du titre
const titreEcheanceFind = titreDemarches =>
  titreDemarches
    // filtre les démarches dont le statut est acceptée ou terminée
    .filter(titreDemarche =>
      ['acc', 'ter'].includes(titreDemarche.demarcheStatutId)
    )
    // parcourt les démarches
    .reduce(
      (acc, titreDemarche) =>
        // si la date d'échéance n'est pas définie
        !acc.echeance
          ? // trouve la date d'échéance de la démarche
            titreDemarcheEcheanceFind(titreDemarche, acc)
          : // sinon, retourne l'accumulateur en l'état
            acc,
      // l'accumulateur contient initialement
      // - la durée
      // - la date d'échéance si elle est définie
      {
        duree: 0,
        echeance: null
      }
    ).echeance

module.exports = titreEcheanceFind
