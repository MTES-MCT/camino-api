import {
  ITitreDemarche,
  ITitre,
  ITitreEtape,
  TitreEtapeProp
} from '../../types'

import titrePropEtapeIdFind from './titre-prop-etape-id-find'
import titreStatutIdFind from './titre-statut-id-find'

const titreEtapeFind = (
  titreDemarches: ITitreDemarche[],
  titreEtapeId: string
) => {
  if (!titreDemarches.length) return null

  let titreEtape

  for (const titreDemarche of titreDemarches) {
    if (!titreDemarche.etapes?.length) continue

    titreEtape = titreDemarche.etapes.find(
      titreEtape => titreEtape.id === titreEtapeId
    )

    if (titreEtape) break
  }

  return titreEtape
}

// filtre les étapes et démarches antérieures à une date
const titreDemarchesEtapesFilter = (
  titreDemarches: ITitreDemarche[],
  date: string
) =>
  titreDemarches.filter(titreDemarche => {
    if (titreDemarche.etapes) {
      const titreEtapesFiltered = titreDemarche.etapes.filter(
        titreEtape => titreEtape.date <= date
      )

      if (titreEtapesFiltered.length) {
        titreDemarche.etapes = titreEtapesFiltered

        return true
      }
    }

    return false
  })

const propFind = (titreEtapes: ITitreEtape[], prop: TitreEtapeProp) => {
  for (const titreEtape of titreEtapes) {
    const value = titreEtape[prop]

    if (
      value !== undefined &&
      value !== null &&
      (!Array.isArray(value) || value.length)
    ) {
      return titreEtape.id
    }
  }

  return null
}

// trouve  relative à une étape
const titreEtapePropFind = (
  prop: TitreEtapeProp,
  titreEtape: ITitreEtape,
  titreDemarcheEtapes: ITitreEtape[],
  titre: ITitre
) => {
  try {
    if (!titre.demarches?.length) return null

    // filtre les démarches et étapes antérieures à la date de l'étape sélectionnée
    titre.demarches = titreDemarchesEtapesFilter(
      titre.demarches,
      titreEtape.date
    )

    // cherche l'étape qui contient la propriété dans la même démarche
    let propTitreEtapeId = propFind(titreDemarcheEtapes, prop)

    // sinon (la propriété n'est pas dans la démarche)
    // cherche la propriété dans les démarches précédentes

    if (!propTitreEtapeId) {
      // recalcule le statut du titre
      titre.statutId = titreStatutIdFind(titre)

      // cherche la première occurrence de la propriété
      // dans une démarche et une étape valides
      propTitreEtapeId = titrePropEtapeIdFind(
        titre.demarches,
        titre.statutId!,
        prop
      )
    }

    if (propTitreEtapeId) {
      const propTitreEtape = titreEtapeFind(titre.demarches, propTitreEtapeId)

      return propTitreEtape ? propTitreEtape[prop] : null
    }

    return null
  } catch (e) {
    console.error(`erreur: titreEtapePropFind ${titreEtape.id}`)
    console.error(e)
    throw e
  }
}

export default titreEtapePropFind
