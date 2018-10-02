const { titresDemarchesGet } = require('../postgres/queries/titres-demarches')
const {
  titresPhasesGet,
  titrePhaseUpdate,
  titrePhaseDelete
} = require('../postgres/queries/titres-phases')

const titreEtapesSortAsc = require('./_utils/titre-etapes-sort-asc')
const titrePhasesFind = require('./_utils/titre-phases-find')
const dateFormat = require('dateformat')

const titresPhasesUpdate = async () => {
  // retourne les démarches enregistrées en base
  const titresDemarches = await titresDemarchesGet({})

  // retourne les phases enregistrées en base
  const titresPhasesOld = await titresPhasesGet({})

  // filtre les démarches qui donnent lieu à des phases
  // regroupe les démarches par titre
  const titresDemarchesGroupedByTitres = titresDemarches
    .filter(titreDemarcheFilter)
    .reduce(titreDemarchesByTitreGroup, {})

  // retourne un tableau avec les phases
  // crées à partir des démarches
  const titresPhases = Object.keys(titresDemarchesGroupedByTitres).reduce(
    (res, titreId) => [
      ...res,
      ...titrePhasesFind(titresDemarchesGroupedByTitres[titreId])
    ],
    []
  )

  // retourne un tableau de requêtes pour
  // - créer les nouvelles phases
  // - modifier les phases existantes
  const titresPhasesUpdated = titresPhases.reduce(
    (res, titrePhase) =>
      titrePhasesUpdatedList(res, titrePhase, titresPhasesOld),
    []
  )

  // retourne un tableau de requêtes pour
  // - supprimer les phases qui n'existent plus
  const titrePhasesDeleted = titresPhasesOld.reduce(
    (res, titrePhaseOld) =>
      titrePhasesDeletedList(res, titrePhaseOld, titresPhases),
    []
  )

  await Promise.all([...titresPhasesUpdated, ...titrePhasesDeleted])

  return `Mise à jour: ${titresPhasesUpdated.length} phases de titres.`
}

// si
// - la démarche est un octroi ou une prolongation ou une prolongation 1
// ou une prolongation 2 ou une prolongation exceptionnelle
// - le statut de la démarche est acceptée
// - la démarche a une étape de dpu
// - le statut de l'étape de dpu est acceptée

const titreDemarcheFilter = titreDemarche => {
  // retourne l'étape de dpu de la démarche si elle existe
  const etapeDpuFirst = titreEtapesSortAsc(titreDemarche).find(
    titreEtape => titreEtape.etapeId === 'dpu'
  )

  return (
    (titreDemarche.demarcheId === 'oct' ||
      titreDemarche.demarcheId === 'pro' ||
      titreDemarche.demarcheId === 'pr1' ||
      titreDemarche.demarcheId === 'pr2' ||
      titreDemarche.demarcheId === 'pre') &&
    titreDemarche.demarcheStatutId === 'acc' &&
    etapeDpuFirst &&
    etapeDpuFirst.etapeStatutId === 'acc'
  )
}

const titreDemarchesByTitreGroup = (titreDemarchesByTitres, titreDemarche) => {
  titreDemarchesByTitres[titreDemarche.titreId] = titreDemarchesByTitres[
    titreDemarche.titreId
  ]
    ? [...titreDemarchesByTitres[titreDemarche.titreId], titreDemarche]
    : [titreDemarche]
  return titreDemarchesByTitres
}

const titrePhasesUpdatedList = (res, titrePhase, titresPhasesOld) => {
  const titrePhaseOld = titrePhaseEqualFind(titrePhase, titresPhasesOld)
  const titrePhasePropsChanged = titrePhaseOld
    ? titrePhasePropsChangedFind(titrePhase, titrePhaseOld)
    : null

  let titrePhaseUpdated

  if (
    // si la phase n'existe pas
    !titrePhaseOld
  ) {
    titrePhaseUpdated = titrePhaseUpdate({ titrePhase }).then(u => {
      console.log(`Création: phase ${titrePhase.titreDemarcheId}`)

      return u
    })
  } else if (
    // si la phase existe et est modifiée
    titrePhasePropsChanged
  ) {
    // console.log(titrePhasePropsChanged)
    titrePhaseUpdated = titrePhaseUpdate({ titrePhase }).then(u => {
      console.log(
        `Mise à jour: phase ${titrePhase.titreDemarcheId}, ${JSON.stringify(
          titrePhasePropsChanged
        )}`
      )

      return u
    })
  }

  return titrePhaseUpdated ? [...res, titrePhaseUpdated] : res
}

const titrePhasesDeletedList = (res, titrePhaseOld, titresPhases) => {
  const titrePhase = titrePhaseEqualFind(titrePhaseOld, titresPhases)

  let titrePhaseDeleted

  if (!titrePhase) {
    titrePhaseDeleted = titrePhaseDelete({
      titreDemarcheId: titrePhaseOld.titreDemarcheId
    }).then(u => {
      console.log(`Suppression: phase ${titrePhaseOld.titreDemarcheId}`)

      return u
    })
  }
  return titrePhaseDeleted ? [...res, titrePhaseDeleted] : res
}

// retourne une phase parmi les titrePhases qui a la même id que titrePhase
const titrePhaseEqualFind = (titrePhase, titrePhases) =>
  titrePhases.find(tp => tp.titreDemarcheId === titrePhase.titreDemarcheId)

// retourne les propriétés de la phase existante
// qui sont différentes de la nouvelle phase
const titrePhasePropsChangedFind = (titrePhase, titrePhaseOld) =>
  Object.keys(titrePhase).reduce((res, key) => {
    if (titrePhaseOld[key] instanceof Date) {
      titrePhaseOld[key] = dateFormat(titrePhaseOld[key], 'yyyy-mm-dd')
    }

    const mod = { [key]: [titrePhaseOld[key], titrePhase[key]] }

    return titrePhase[key] === titrePhaseOld[key]
      ? res
      : res
        ? Object.assign(res, mod)
        : mod
  }, null)

module.exports = titresPhasesUpdate
