import { objectClone } from '../../tools/object-clone'
import { ITitreDemarche, ITitreEtape, ITitreEtapeProp } from '../../types'

import { titrePropEtapeFind } from './titre-prop-etape-find'
import { titreStatutIdFind } from './titre-statut-id-find'

const propFind = (titreEtape: ITitreEtape, prop: ITitreEtapeProp) => {
  const value = titreEtape[prop]
  if (
    value !== undefined &&
    value !== null &&
    (!Array.isArray(value) || value.length)
  ) {
    return titreEtape[prop]
  }

  return null
}

/**
 * filtre les étapes antérieures à une date
 * @param titreEtapes - étapes d'une démarche
 * @param date - date
 */
const titreEtapesDateFilter = (titreEtapes: ITitreEtape[], date: string) =>
  titreEtapes.filter(titreEtape => titreEtape.date <= date)

/**
 * filtre les démarches et étapes antérieures à une date
 * @param titreDemarches - démarches du titre
 * @param date - date
 */

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

      return false
    }

    return false
  })

/**
 * Trouve la propriété d'un titre à une date donnée
 * @param prop - propriété recherchée
 * @param date - date
 * @param titreDemarches - démarches du titre
 * @returns la propriété recherchée ou null
 */
const titreEtapePropFind = (
  prop: ITitreEtapeProp,
  date: string,
  titreDemarches: ITitreDemarche[]
) => {
  const titreDemarchesCopy = objectClone(titreDemarches)
  // filtre les démarches et étapes antérieures à la date de l'étape sélectionnée
  const titreDemarchesFiltered = titreDemarchesEtapesFilter(
    titreDemarchesCopy,
    date
  )

  // calcule le statut du titre
  const titreStatutId = titreStatutIdFind(date, titreDemarchesFiltered)

  // cherche la première occurrence de la propriété
  // dans une démarche et une étape valides
  const titreEtape = titrePropEtapeFind(
    prop,
    titreDemarchesFiltered,
    titreStatutId!
  )

  if (titreEtape) {
    return propFind(titreEtape, prop)
  }

  return null
}

export { titreEtapePropFind }
