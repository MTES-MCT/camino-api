import * as dateFormat from 'dateformat'

import {
  titrePhaseUpdate as queryTitrePhaseUpdate,
  titrePhaseDelete as queryTitrePhaseDelete
} from '../database/queries/titres-phases'

const titrePhaseUpdate = (titrePhase, titresPhasesOld) => {
  const titrePhaseOld = titrePhaseEqualFind(
    titrePhase.titreDemarcheId,
    titresPhasesOld
  )
  const titrePhasePropsChanged = titrePhaseOld
    ? titrePhasePropsChangedFind(titrePhase, titrePhaseOld)
    : null

  let titrePhaseUpdated

  if (
    // si la phase n'existe pas
    !titrePhaseOld
  ) {
    titrePhaseUpdated = queryTitrePhaseUpdate({ titrePhase }).then(
      u => `Création: phase ${titrePhase.titreDemarcheId}`
    )
  } else if (
    // si la phase existe et est modifiée
    titrePhasePropsChanged
  ) {
    titrePhaseUpdated = queryTitrePhaseUpdate({ titrePhase }).then(
      u =>
        `Mise à jour: phase ${titrePhase.titreDemarcheId}, ${JSON.stringify(
          titrePhasePropsChanged
        )}`
    )
  }

  return titrePhaseUpdated ? titrePhaseUpdated : null
}

const titrePhaseDelete = (titrePhaseOld, titresPhases) => {
  const titrePhase = titrePhaseEqualFind(
    titrePhaseOld.titreDemarcheId,
    titresPhases
  )

  let titrePhaseDeleted

  if (!titrePhase) {
    titrePhaseDeleted = queryTitrePhaseDelete({
      titreDemarcheId: titrePhaseOld.titreDemarcheId
    }).then(u => `Suppression: phase ${titrePhaseOld.titreDemarcheId}`)
  }
  return titrePhaseDeleted ? titrePhaseDeleted : null
}

// retourne une phase parmi les titrePhases en fonction de son id
const titrePhaseEqualFind = (titreDemarcheId, titrePhases) =>
  titrePhases.find(tp => tp.titreDemarcheId === titreDemarcheId)

// retourne les propriétés de la phase existante
// qui sont différentes de la nouvelle phase
const titrePhasePropsChangedFind = (titrePhase, titrePhaseOld) =>
  Object.keys(titrePhase).reduce((res, key) => {
    if (titrePhaseOld[key] instanceof Date) {
      titrePhaseOld[key] = dateFormat(titrePhaseOld[key], 'yyyy-mm-dd')
    }

    if (titrePhase[key] === titrePhaseOld[key]) return res

    const mod = { [key]: [titrePhaseOld[key], titrePhase[key]] }

    return res ? Object.assign(res, mod) : mod
  }, null)

export { titrePhaseUpdate, titrePhaseDelete }
