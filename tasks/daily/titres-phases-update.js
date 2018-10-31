const { titresGet } = require('../../postgres/queries/titres')
const {
  titresDemarchesGet
} = require('../../postgres/queries/titres-demarches')
const { titresPhasesGet } = require('../../postgres/queries/titres-phases')
const { titrePhaseUpdate, titrePhaseDelete } = require('../titre-phases')

const titrePhasesFind = require('../_utils/titre-phases-find')
const titreDemarchePhasesFilter = require('../_utils/titre-demarche-phases-filter')

const titresPhasesUpdate = async () => {
  // retourne les démarches enregistrées en base
  const titresDemarches = await titresDemarchesGet({})

  // retourne les phases enregistrées en base
  const titresPhasesOld = await titresPhasesGet()

  const titres = await titresGet({})

  // filtre les démarches qui donnent lieu à des phases
  // regroupe les démarches par titre
  const titresDemarchesGroupedByTitres = titresDemarches
    .filter(titreDemarche => {
      titreDemarche.titreIsAxm =
        titres.find(t => t.id === titreDemarche.titreId).typeId === 'axm'
      return titreDemarchePhasesFilter(titreDemarche)
    })
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
    (res, titrePhase) => titrePhaseUpdate(res, titrePhase, titresPhasesOld),
    []
  )

  // retourne un tableau de requêtes pour
  // - supprimer les phases qui n'existent plus
  const titrePhasesDeleted = titresPhasesOld.reduce(
    (res, titrePhaseOld) => titrePhaseDelete(res, titrePhaseOld, titresPhases),
    []
  )

  await Promise.all([...titresPhasesUpdated, ...titrePhasesDeleted])

  return `Mise à jour: ${titresPhasesUpdated.length} phases de titres.`
}

const titreDemarchesByTitreGroup = (titreDemarchesByTitres, titreDemarche) => {
  titreDemarchesByTitres[titreDemarche.titreId] = titreDemarchesByTitres[
    titreDemarche.titreId
  ]
    ? [...titreDemarchesByTitres[titreDemarche.titreId], titreDemarche]
    : [titreDemarche]
  return titreDemarchesByTitres
}

module.exports = titresPhasesUpdate
