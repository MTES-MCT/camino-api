const { titrePhaseUpdate, titrePhaseDelete } = require('../titre-phases')

const titrePhasesFind = require('../_utils/titre-phases-find')

const titresPhasesUpdate = async (titres, titresDemarches, titresPhasesOld) => {
  // créé un objet la liste des titres { [titreId]: titre.typeId, … }
  const titreTypeIdsList = titres.reduce((res, titre) => {
    res[titre.id] = titre.typeId
    return res
  }, {})

  // regroupe les démarches par titre
  const titresDemarchesGroupedByTitres = titreDemarchesByTitreGroup(
    titresDemarches
  )

  // retourne un tableau avec les phases
  // crées à partir des démarches
  const titresPhases = Object.keys(titresDemarchesGroupedByTitres).reduce(
    (res, titreId) => [
      ...res,
      ...titrePhasesFind(
        titresDemarchesGroupedByTitres[titreId],
        titreTypeIdsList[titreId]
      )
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

const titreDemarchesByTitreGroup = titreDemarches =>
  titreDemarches.reduce((titreDemarchesByTitres, titreDemarche) => {
    titreDemarchesByTitres[titreDemarche.titreId] = titreDemarchesByTitres[
      titreDemarche.titreId
    ]
      ? [...titreDemarchesByTitres[titreDemarche.titreId], titreDemarche]
      : [titreDemarche]
    return titreDemarchesByTitres
  }, {})

module.exports = titresPhasesUpdate
