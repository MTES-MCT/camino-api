import * as dateFormat from 'dateformat'
import titreEtapesAscSort from '../utils/titre-etapes-asc-sort'
import titreEtapesDescSort from '../utils/titre-etapes-desc-sort'

// entrée:
// - les démarches d'un titre
// - l'ordre d'une démarche dont on cherche la date de fin et la durée
// sortie
// - la date de fin de la démarche
// - la durée cumulée depuis la date de fin précédemment enregistré dans la bdd
const titreDemarcheDateFinAndDureeFind = (titreDemarches, ordre) =>
  titreDemarches.reduce(
    ({ duree, dateFin }, titreDemarche) => {
      if (
        // la date de fin est déjà définie -> retourne l'accumulateur tel quel
        dateFin ||
        // filtre les démarches précédentes dont le statut est acceptée ou terminée
        (!['acc', 'ter'].includes(titreDemarche.statutId) ||
          ordre < titreDemarche.ordre)
      ) {
        return { duree, dateFin }
      }

      // la démarche est un octroi
      if (titreDemarche.typeId === 'oct') {
        return titreDemarcheOctroiDateFinFind(duree, titreDemarche)
      }

      if (
        // la démarche est une abrogation, retrait ou renonciation
        titreDemarche.typeId === 'abr' ||
        titreDemarche.typeId === 'ret' ||
        (titreDemarche.typeId === 'ren' &&
          // si c'est une renonciation et que la démarche contient une étape avec des infos géo (points)
          // alors c'est une renonciation partielle et elle n'est pas prise en compte
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
    // si il n'y a ni date de fin, ni de durée cumulée,
    // la date de fin par défaut est fixée au 31 décembre 2018,
    // selon l'article L144-4 du code minier :
    // https://www.legifrance.gouv.fr/affichCodeArticle.do?cidTexte=LEGITEXT000023501962&idArticle=LEGIARTI000023504741
    if (duree === 0) {
      return '2018-12-31'
    }

    const titreEtapesDescSorted =
      titreDemarche.etapes && titreEtapesDescSort(titreDemarche.etapes)

    // chercher dans les dex, dpu et rpu s'il y a une date de debut
    const titreEtapeHasDateDebut = titreEtapesDescSorted.find(
      te => ['dex', 'dpu', 'rpu'].includes(te.typeId) && te.dateDebut
    )

    if (titreEtapeHasDateDebut) {
      return dateAddYears(titreEtapeHasDateDebut.dateDebut, duree)
    }

    // sinon, la date de fin est calculée
    // en ajoutant la durée cumulée à la date de la première dpu ou ens
    const titreEtapeDpuFirst = titreEtapesAscSort(titreDemarche.etapes).find(
      titreEtape => titreEtape.typeId === 'dpu'
    )

    if (titreEtapeDpuFirst) {
      return dateAddYears(titreEtapeDpuFirst.date, duree)
    }

    // si on ne trouve pas de dpu, la date de fin est calculée
    // en ajoutant la date de la première dex
    const titreEtapeDexFirst = titreEtapesAscSort(titreDemarche.etapes).find(
      titreEtape => titreEtape.typeId === 'dex'
    )

    return titreEtapeDexFirst
      ? dateAddYears(titreEtapeDexFirst.date, duree)
      : null
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
    const etapeDexHasDateFin = titreEtapesDescSort(titreDemarche.etapes).find(
      te => te.typeId === 'dex' && te.dateFin
    )

    // si la démarche contient une date de fin
    if (etapeDexHasDateFin) {
      return dateFormat(etapeDexHasDateFin.dateFin, 'yyyy-mm-dd')
    }

    // sinon,
    // trouve la première étape de décision expresse (dex)
    const etapeDex = titreEtapesAscSort(titreDemarche.etapes).find(
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
  titreEtapes = titreEtapesDescSort(titreEtapes)

  const titreEtapeHasDateFinOrDuree = titreEtapes.find(
    ({ typeId, dateFin, duree }) =>
      // filtre les étapes dont le type est décision express (dex)
      // et decision de publication au JORF (dpu)
      // et publication au recueil des actes administratifs de la préfecture (rpu)
      ['dex', 'dpu', 'rpu'].includes(typeId) &&
      // retourne la première date de fin ou durée trouvée
      (dateFin || duree)
  )

  if (!titreEtapeHasDateFinOrDuree) {
    return { dateFin: null, duree: dureeAcc }
  }

  const { dateFin, duree } = titreEtapeHasDateFinOrDuree

  // retourne la date de fin et
  // ajoute la durée calculée à la durée cumulée
  return {
    duree: duree ? duree + dureeAcc : dureeAcc,
    dateFin: dateFin ? dateAddYears(dateFin, dureeAcc) : null
  }
}

// ajoute une durée en années à une date au format YYYY-MM-DD
const dateAddYears = (date, years) => {
  const d = dateFormat(date, 'yyyy-mm-dd')
  return `${Number(d.slice(0, 4)) + years}-${d.slice(5)}`
}

export default titreDemarcheDateFinAndDureeFind
