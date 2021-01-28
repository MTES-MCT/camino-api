import { ITitreDemarche, ITitreEtape, ITitreEtapeProp } from '../../types'

import titrePropEtapeIdFind from './titre-prop-etape-id-find'
import { titreStatutIdFind } from './titre-statut-id-find'

const titreEtapeFind = (
  titreDemarches: ITitreDemarche[],
  titreEtapeId: string
) => {
  let titreEtape

  for (const titreDemarche of titreDemarches) {
    titreEtape = titreDemarche.etapes!.find(
      titreEtape => titreEtape.id === titreEtapeId
    )

    if (titreEtape) {
      break
    }
  }

  return titreEtape
}

const propFind = (titreEtapes: ITitreEtape[], prop: ITitreEtapeProp) => {
  for (const titreEtape of titreEtapes) {
    const value = titreEtape[prop]

    if (
      value !== undefined &&
      value !== null &&
      (!Array.isArray(value) || value.length)
    ) {
      return titreEtape[prop]
    }
  }

  return null
}

// filtre les étapes antérieures à une date
const titreEtapesDateFilter = (titreEtapes: ITitreEtape[], date: string) =>
  titreEtapes.filter(titreEtape => titreEtape.date <= date)

// filtre les étapes et démarches antérieures à une date
const titreDemarchesEtapesFilter = (
  titreDemarches: ITitreDemarche[],
  date: string
) =>
  titreDemarches.filter(titreDemarche => {
    if (titreDemarche.etapes) {
      const titreEtapesFiltered = titreEtapesDateFilter(
        titreDemarche.etapes,
        date
      )

      if (titreEtapesFiltered.length) {
        titreDemarche.etapes = titreEtapesFiltered

        return true
      }
    }

    return false
  })

// trouve  relative à une étape
const titreEtapePropFind = (
  prop: ITitreEtapeProp,
  titreEtape: ITitreEtape,
  titreDemarcheEtapes: ITitreEtape[],
  aujourdhui: string,
  titreDemarches?: ITitreDemarche[] | null
) => {
  try {
    // filtre les étapes antérieures à la date de l'étape sélectionnée
    const titreDemarcheEtapesFiltered = titreEtapesDateFilter(
      titreDemarcheEtapes,
      titreEtape.date
    )

    // cherche l'étape qui contient la propriété dans la même démarche
    const titreEtapeProp = propFind(titreDemarcheEtapesFiltered, prop)
    if (titreEtapeProp) return titreEtapeProp

    // sinon (la propriété n'est pas dans la démarche)
    // cherche la propriété dans les démarches précédentes
    if (!titreDemarches?.length) return null

    // filtre les démarches et étapes antérieures à la date de l'étape sélectionnée
    const titreDemarchesFiltered = titreDemarchesEtapesFilter(
      titreDemarches,
      titreEtape.date
    )

    // calcule le statut du titre
    const titreStatutId = titreStatutIdFind(aujourdhui, titreDemarchesFiltered)

    // cherche la première occurrence de la propriété
    // dans une démarche et une étape valides
    const propTitreEtapeId = titrePropEtapeIdFind(
      prop,
      titreDemarchesFiltered,
      titreStatutId!
    )

    if (propTitreEtapeId) {
      const propTitreEtape = titreEtapeFind(
        titreDemarchesFiltered,
        propTitreEtapeId
      )

      return propTitreEtape![prop]
    }

    return null
  } catch (e) {
    console.error(`erreur: titreEtapePropFind ${titreEtape.id}`)
    console.error(e)
    throw e
  }
}

export { titreEtapePropFind }
