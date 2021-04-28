import { ITitreDemarche, ITitreEtape } from '../../types'

import titreEtapesSortAsc from '../utils/titre-etapes-sort-asc'
import titreEtapesSortDesc from '../utils/titre-etapes-sort-desc'

import { titreDemarcheAnnulationDateFinFind } from './titre-demarche-annulation-date-fin-find'
import { dateAddMonths, datesSubtract } from '../../tools/date'

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
      // - ou c'est une renonciation
      //   - et ce n'est pas une renonciation partielle
      //   (= ne contient pas d'étape avec des infos géo (points)
      // retourne la date de fin d'une démarche d'annulation
      if (
        titreDemarche.typeId === 'ret' ||
        (titreDemarche.typeId === 'ren' &&
          !titreDemarche.etapes.find(te => te.points?.length))
      ) {
        return {
          duree: 0,
          dateFin: titreDemarcheAnnulationDateFinFind(titreDemarche.etapes)
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

const titreDemarcheOctroiDateDebutFind = (titreEtapes: ITitreEtape[]) => {
  const titreEtapesSorted = titreEtapes && titreEtapesSortDesc(titreEtapes)

  // chercher dans les étapes de publication et décisives s'il y a une date de debut
  const titreEtapeHasDateDebut = titreEtapesSorted.find(
    te =>
      [
        'dpu',
        'dup',
        'rpu',
        'dex',
        'dux',
        'dim',
        'def',
        'sco',
        'aco',
        'ihi'
      ].includes(te.typeId) && te.dateDebut
  )

  if (titreEtapeHasDateDebut) {
    return titreEtapeHasDateDebut.dateDebut!
  }

  // sinon, la date de fin est calculée
  // en ajoutant la durée cumulée à la date de la première étape de publication
  const titreEtapeDpuFirst = titreEtapesSortAsc(titreEtapes).find(titreEtape =>
    ['dpu', 'dup', 'def', 'sco', 'aco'].includes(titreEtape.typeId)
  )

  if (titreEtapeDpuFirst) {
    return titreEtapeDpuFirst.date
  }

  // si on ne trouve pas de dpu, la date de fin est calculée
  // en ajoutant la date de la première étape décisive
  const titreEtapeDexFirst = titreEtapesSortAsc(titreEtapes).find(titreEtape =>
    ['dex', 'dux', 'ihi'].includes(titreEtape.typeId)
  )

  return titreEtapeDexFirst ? titreEtapeDexFirst.date : null
}

// trouve la date de fin et la durée d'une démarche d'octroi
const titreDemarcheOctroiDateFinAndDureeFind = (
  dureeAcc: number,
  titreEtapes: ITitreEtape[]
) => {
  // retourne la durée cumulée et la date de fin
  // de la démarche d'octroi
  let { duree, dateFin } = titreDemarcheNormaleDateFinAndDureeFind(
    0,
    titreEtapes
  )

  const dateDebut = titreDemarcheOctroiDateDebutFind(titreEtapes)

  if (!dateDebut) {
    return { duree: dureeAcc, dateFin }
  }

  // Si la démarche d’octroi a une date de fin,
  // alors la durée est calculée à partir de la date de début
  // la durée et la date de fin sont cumulées avec la durée accumulée
  if (dateFin) {
    return {
      duree: datesSubtract(dateDebut, dateFin!) + dureeAcc,
      dateFin: dateAddMonths(dateFin, dureeAcc)
    }
  }

  if (!duree) {
    // si il n'y a pas de durée,
    // la date de fin par défaut est fixée au 31 décembre 2018,
    // selon l'article L144-4 du code minier :
    // https://www.legifrance.gouv.fr/affichCodeArticle.do?cidTexte=LEGITEXT000023501962&idArticle=LEGIARTI000023504741
    dateFin = '2018-12-31'
    // on calcule la durée que sépare la date de début et la date de fin
    duree = datesSubtract(dateDebut, dateFin!)
    // on met à jour la date de fin avec la durée accumulée
    dateFin = dateAddMonths(dateFin, dureeAcc)
  } else {
    // on calcule la date de fin avec la date de début
    // et la durée de l’octroi et la durée accumulée
    dateFin = dateAddMonths(dateDebut, duree + dureeAcc)
  }

  return {
    duree: dureeAcc + duree,
    dateFin
  }
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
  const titreEtapesSorted = titreEtapesSortDesc(titreEtapes)
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

export default titreDemarcheDateFinAndDureeFind
