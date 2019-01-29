const dateFormat = require('dateformat')

const {
  titrePhaseUpdate,
  titrePhaseDelete
} = require('../database/queries/titres-phases')

const titrePhases = {
  titrePhaseUpdate(res, titrePhase, titresPhasesOld) {
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
  },

  titrePhaseDelete(res, titrePhaseOld, titresPhases) {
    const titrePhase = titrePhaseEqualFind(
      titrePhaseOld.titreDemarcheId,
      titresPhases
    )

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

    const mod = { [key]: [titrePhaseOld[key], titrePhase[key]] }

    return titrePhase[key] === titrePhaseOld[key]
      ? res
      : res
      ? Object.assign(res, mod)
      : mod
  }, null)

module.exports = titrePhases
