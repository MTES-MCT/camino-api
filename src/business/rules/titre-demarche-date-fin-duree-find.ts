import { ITitreDemarche, ITitreEtape } from '../../types'

import * as dateFormat from 'dateformat'
import titreEtapesAscSort from '../utils/titre-etapes-asc-sort'
import titreEtapesDescSort from '../utils/titre-etapes-desc-sort'

// entrée
// - les démarches d'un titre
// - l'ordre d'une démarche dont on cherche la date de fin et la durée
// sortie
// - la date de fin de la démarche
// - la durée cumulée depuis la date de fin précédemment enregistré dans la bdd
const titreDemarcheDateFinAndDureeFind = (
  titreDemarches: ITitreDemarche[],
  ordre: number
) =>
  titreDemarches.reduce(
    (
      { duree, dateFin }: { duree: number; dateFin: string | null | undefined },
      titreDemarche
    ) => {
      if (!titreDemarche.etapes) return { duree, dateFin }

      // si
      // - la date de fin est déjà définie
      // - ou la démarche n'a pas un statut acceptée ou terminée
      // - ou l'ordre de la démarche est supérieur à celui donné en paramètre
      // retourne l'accumulateur tel quel
      if (
        dateFin ||
        !['acc', 'ter'].includes(titreDemarche.statutId!) ||
        titreDemarche.ordre! > ordre
      ) {
        return { duree, dateFin }
      }

      // si
      // - la démarche est un octroi
      if (['oct', 'vut', 'vct'].includes(titreDemarche.typeId)) {
        return titreDemarcheOctroiDateFinAndDureeFind(
          duree,
          titreDemarche.etapes
        )
      }

      // si
      // - la démarche est une abrogation ou retrait
      // retourne la date de fin d'une démarche d'annulation
      if (['abr', 'ret'].includes(titreDemarche.typeId)) {
        return {
          duree: 0,
          dateFin: titreDemarcheAnnulationDateFinFind(titreDemarche.etapes)
        }
      }

      // si
      // - c'est une renonciation
      // - ça n'est pas une renonciation partielle
      // (= ne contient pas d'étape avec des infos géo (points)
      // retourne la date de fin d'une démarche de renonciation
      if (
        titreDemarche.typeId === 'ren' &&
        !titreDemarche.etapes.find(te => te.points!.length)
      ) {
        return {
          duree: 0,
          dateFin: titreDemarcheRenonciationDateFinFind(titreDemarche.etapes)
        }
      }

      // sinon
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

const titreDemarcheOctroiDateFinFind = (
  duree: number,
  titreEtapes: ITitreEtape[]
) => {
  // si il n'y a pas de durée cumulée,
  // la date de fin par défaut est fixée au 31 décembre 2018,
  // selon l'article L144-4 du code minier :
  // https://www.legifrance.gouv.fr/affichCodeArticle.do?cidTexte=LEGITEXT000023501962&idArticle=LEGIARTI000023504741
  if (duree === 0) {
    return '2018-12-31'
  }

  const titreEtapesDescSorted = titreEtapes && titreEtapesDescSort(titreEtapes)

  // chercher dans les étapes de publication et décisives s'il y a une date de debut
  const titreEtapeHasDateDebut = titreEtapesDescSorted.find(
    te =>
      ['dpu', 'dup', 'rpu', 'dex', 'dux', 'dim', 'def', 'sco', 'aco'].includes(
        te.typeId
      ) && te.dateDebut
  )

  if (titreEtapeHasDateDebut) {
    return dateAddMonths(titreEtapeHasDateDebut.dateDebut!, duree)
  }

  // sinon, la date de fin est calculée
  // en ajoutant la durée cumulée à la date de la première étape de publication
  const titreEtapeDpuFirst = titreEtapesAscSort(titreEtapes).find(titreEtape =>
    ['dpu', 'dup', 'sco', 'def', 'aco'].includes(titreEtape.typeId)
  )

  if (titreEtapeDpuFirst) {
    return dateAddMonths(titreEtapeDpuFirst.date, duree)
  }

  // si on ne trouve pas de dpu, la date de fin est calculée
  // en ajoutant la date de la première étape décisive
  const titreEtapeDexFirst = titreEtapesAscSort(titreEtapes).find(titreEtape =>
    ['dex', 'dux', 'def', 'sco', 'aco'].includes(titreEtape.typeId)
  )

  return titreEtapeDexFirst
    ? dateAddMonths(titreEtapeDexFirst.date, duree)
    : null
}

// trouve la date de fin et la durée d'une démarche d'octroi
const titreDemarcheOctroiDateFinAndDureeFind = (
  dureeAcc: number,
  titreEtapes: ITitreEtape[]
) => {
  // retourne la durée cumulée et la date de fin
  // de la démarche d'octroi
  let { duree, dateFin } = titreDemarcheNormaleDateFinAndDureeFind(
    dureeAcc,
    titreEtapes
  )

  dateFin = dateFin || titreDemarcheOctroiDateFinFind(duree, titreEtapes)

  return {
    duree,
    dateFin
  }
}

// trouve la date de fin d'une démarche d'annulation
const titreDemarcheAnnulationDateFinFind = (titreEtapes: ITitreEtape[]) => {
  // la dernière étape dex ou dux qui contient une date de fin
  const etapeDexHasDateFin = titreEtapesDescSort(titreEtapes).find(
    te => ['dex', 'dux'].includes(te.typeId) && te.dateFin
  )

  // si la démarche contient une date de fin
  if (etapeDexHasDateFin) {
    return etapeDexHasDateFin.dateFin
  }

  // sinon,
  // trouve la première étape de décision expresse (dex) ou unilatérale (dux)
  const etapeDex = titreEtapesAscSort(titreEtapes).find(te =>
    ['dex', 'dux'].includes(te.typeId)
  )

  // la date de fin est la date de l'étape
  return etapeDex?.date ? etapeDex.date : null
}

// trouve la date de fin d'une démarche de renonciation
const titreDemarcheRenonciationDateFinFind = (titreEtapes: ITitreEtape[]) => {
  // la dernière étape de dpu

  const etapeDpu = titreEtapesDescSort(titreEtapes).find(
    te =>
      ['dpu', 'dup'].includes(te.typeId) ||
      // ATTENTION ! l'étape de DEX n'est valide que pour les AXM
      // or, le type de titre n'est pas passé à la fonction
      // TODO: deux solutions :
      // 1- ajout d'un paramètre `titreTypeId` partout où nécessaire
      // 2- création d'une nouvelle étape DEP pour les AXM
      ['dex', 'dux'].includes(te.typeId)
  )

  // la date de fin est la date de l'étape
  return etapeDpu && etapeDpu.date ? etapeDpu.date : null
}

// entrées:
// - les étapes d'une démarche
// - la durée cumulée
// retourne
// - dateFin: la date de fin de la démarche si définie, sinon null
// - duree: la durée cumulée
const titreDemarcheNormaleDateFinAndDureeFind = (
  dureeAcc: number,
  titreEtapes: ITitreEtape[]
) => {
  // la dernière étape
  // - dont le type est décision express (dex)
  //   ou decision de publication au JORF (dpu)
  //   ou publication au recueil des actes administratifs de la préfecture (rpu)
  // - qui possède une date de fin ou durée
  const titreEtapesSorted = titreEtapesDescSort(titreEtapes)
  const titreEtapeHasDateFinOrDuree = titreEtapesSorted.find(
    ({ typeId, dateFin, duree }) =>
      ['dpu', 'dup', 'rpu', 'dex', 'dux', 'def', 'sco', 'aco'].includes(
        typeId
      ) &&
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
    dateFin: dateFin ? dateAddMonths(dateFin, dureeAcc) : null
  }
}

// ajoute une durée en mois à une string au format YYYY-MM-DD
const dateAddMonths = (date: string, months: number) => {
  const [y, m, d] = date.split('-')

  return dateFormat(new Date(+y, +m - 1 + months, +d), 'yyyy-mm-dd')
}

export default titreDemarcheDateFinAndDureeFind
