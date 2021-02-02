import { objectClone } from '../../tools/index'
import { ITitreDemarche, ITitreEtape, IPropId } from '../../types'
import { propValueFind } from '../utils/prop-value-find'

import { titrePropTitreEtapeFind } from './titre-prop-etape-find'
import { titreStatutIdFind } from './titre-statut-id-find'

/**
 * Filtre les étapes antérieures à une date
 * @param titreEtapes - étapes d'une démarche
 * @param date - date
 */
const titreEtapesDateFilter = (titreEtapes: ITitreEtape[], date: string) =>
  titreEtapes.filter(titreEtape => titreEtape.date <= date)

/**
 * Filtre les démarches et étapes antérieures à une date
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
 * @param propId - propriété recherchée
 * @param date - date
 * @param titreDemarches - démarches du titre
 * @returns la ou les propriétés recherchées ou null
 */
const titreEtapePropFind = (
  propId: IPropId,
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
  const titreEtape = titrePropTitreEtapeFind(
    propId,
    titreDemarchesFiltered,
    titreStatutId
  )

  if (titreEtape) {
    return propValueFind(titreEtape, propId)
  }

  return null
}

export { titreEtapePropFind }
