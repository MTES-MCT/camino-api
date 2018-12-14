const dateFormat = require('dateformat')
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
        (titreDemarche.statutId === 'acc' ||
          titreDemarche.statutId === 'ter') &&
        ordre >= titreDemarche.ordre
    )
    // parcourt les démarches
    .reduce(
      ({ duree, dateFin }, titreDemarche) => {
        // la date de fin est déjà définie -> retourne l'accumulateur tel quel
        if (dateFin) {
          return { duree, dateFin }
        }

        if (
          // la démarche est un octroi
          titreDemarche.typeId === 'oct'
        ) {
          return titreDemarcheOctroiDateFinFind(duree, titreDemarche)
        }

        if (
          // la démarche est une abrogation, retrait ou renonciation
          // si c'est une renonciation et que la démarche contient une étape avec des infos géo (points)
          // alors c'est une renonciation partielle et elle n'est pas prise en compte
          titreDemarche.typeId === 'abr' ||
          titreDemarche.typeId === 'ret' ||
          (titreDemarche.typeId === 'ren' &&
            !titreDemarche.etapes.find(te => te.points.length))
        ) {
          // trouve la date de fin d'une démarche d'annulation
          return titreDemarcheAnnulationDateFinFind(titreDemarche)
        }

        // trouve soit la date de fin
        // soit la durée d'une démarche
        return titreDemarcheNormaleDateFinAndDureeFind(
          duree,
          titreDemarche.etapes
        )
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

  const dateFinUpdatedFind = () => {
    if (duree === 0) {
      // si il n'y a ni date de fin, ni de durée cumulée,
      // la date de fin par défaut est fixée au 31 décembre 2018
      return '2018-12-31'
    }

    // retourne une étape de dpu si celle-ci a une date de début
    const titreEtapeDpuHasDateDebut = titreEtapesSortDesc(titreDemarche)
      .filter(te => te.typeId === 'dpu')
      .find(te => te.dateDebut)

    if (titreEtapeDpuHasDateDebut) {
      // si il n'y a ni date de fin, ni durée cumulée,
      // la date de fin par défaut est fixée au 31 décembre 2018
      return dateAddYears(titreEtapeDpuHasDateDebut.dateDebut, duree)
    }

    // sinon, la date de fin est calculée
    // en ajoutant la durée cumulée à la date de la première dpu ou ens
    const titreEtapeDpuFirst = titreEtapesSortAsc(titreDemarche).find(
      titreEtape => titreEtape.typeId === 'dpu'
    )

    return titreEtapeDpuFirst ? dateAddYears(titreEtapeDpuFirst.date, duree) : 0
  }

  // si la démarche contient une date de fin,
  // sinon trouve une date de fin
  const dateFinUpdated = dateFin || dateFinUpdatedFind()

  return {
    duree,
    dateFin: dateFinUpdated
  }
}

// trouve la date de fin d'une démarche d'annulation
const titreDemarcheAnnulationDateFinFind = titreDemarche => {
  const dateFinFind = () => {
    // la dernière étape dex qui contient une date de fin
    const etapeDexHasDateFin = titreEtapesSortDesc(titreDemarche)
      .filter(te => te.typeId === 'dex')
      .find(te => te.dateFin)

    // si la démarche contient une date de fin
    if (etapeDexHasDateFin) {
      return dateFormat(etapeDexHasDateFin, 'yyyy-mm-dd')
    }

    // sinon,
    // trouve la première étape de décision expresse (dex)
    const etapeDex = titreEtapesSortAsc(titreDemarche).find(
      te => te.typeId === 'dex'
    )

    // la date de fin est la date de l'étape
    return dateFormat(etapeDex.date, 'yyyy-mm-dd')
  }

  return {
    duree: 0,
    dateFin: dateFinFind()
  }
}

// entrées:
// - les étapes d'une démarche
// - la durée cumulée
// retourne
// - dateFin: la date de fin de la démarche si définie, sinon null
// - duree: la durée cumulée
const titreDemarcheNormaleDateFinAndDureeFind = (dureeAcc, titreEtapes) => {
  const { duree, dateFin } = titreEtapes
    // filtre les étapes dont le type est décision express (dex)
    // et decision de publication au JORF (dpu)
    .filter(
      titreEtape => titreEtape.typeId === 'dex' || titreEtape.typeId === 'dpu'
    )
    // parcourt les étapes
    .reduce(
      ({ duree, dateFin }, titreEtape) => {
        // si
        // - l'étape courante est une dpu
        // - la durée ou la date de fin a déjà été renseignée
        // retourne l'accumulateur
        if (titreEtape.typeId === 'dpu' && (dateFin || duree)) {
          return { duree, dateFin }
        }

        // si
        // - la date de fin ou la durée est déjà définie OU
        // - l'étape ne contient ni durée, ni date de fin
        // retourne l'accumulateur
        if (dateFin || duree || (!titreEtape.duree && !titreEtape.dateFin)) {
          return { duree, dateFin }
        }

        // sinon
        // - ajoute la durée de l'étape (si elle existe)
        // - trouve la date de fin (si elle existe) avec la durée cumulée
        return {
          duree: titreEtape.duree ? titreEtape.duree : duree,
          dateFin: titreEtape.dateFin
            ? dateAddYears(titreEtape.dateFin, duree + dureeAcc)
            : null
        }
      },
      // l'accumulateur contient initialement
      // - une durée à 0
      // - une date de fin (null)
      { duree: 0, dateFin: null }
    )

  // ajoute la durée calculée à la durée cumulée
  return { duree: duree + dureeAcc, dateFin }
}

// ajoute une durée en années à une date au format YYYY-MM-DD
const dateAddYears = (date, years) => {
  const d = dateFormat(date, 'yyyy-mm-dd')
  return `${Number(d.slice(0, 4)) + years}-${d.slice(5)}`
}

module.exports = titreDemarcheDateFinAndDureeFind
