import { objectClone } from '../../tools'
import { ITitreDemarche, ITitreEtape } from '../../types'
import { titreDemarchePhaseCheck } from '../rules/titre-demarche-phase-check'
import { titreDemarcheStatutIdFind } from '../rules/titre-demarche-statut-id-find'

/**
 * Filtre les étapes antérieures à une date
 * @param titreEtapes - étapes d'une démarche
 * @param date - date
 */
const titreEtapesFilter = (titreEtapes: ITitreEtape[], date: string) =>
  titreEtapes.filter(titreEtape => titreEtape.date <= date)

/**
 * Reconstruit les démarches et étapes antérieures à une date
 * et recalcule le statut des démarches en fonction des étapes
 * @param date - date
 * @param titreDemarches - démarches du titre
 * @param titreTypeId - id du type du titre
 */

const titreDemarchesEtapesRebuild = (
  date: string,
  titreDemarches: ITitreDemarche[],
  titreTypeId: string
) =>
  titreDemarches.reduce((acc: ITitreDemarche[], td) => {
    if (td.etapes) {
      const titreEtapesFiltered = titreEtapesFilter(td.etapes, date)

      if (titreEtapesFiltered.length) {
        const titreDemarche = objectClone(td) as ITitreDemarche
        titreDemarche.etapes = titreEtapesFiltered

        titreDemarche.statutId = titreDemarcheStatutIdFind(
          titreDemarche.typeId,
          titreDemarche.etapes,
          titreTypeId
        )

        if (
          !titreDemarchePhaseCheck(
            titreDemarche.typeId,
            titreDemarche.statutId,
            titreTypeId,
            titreDemarche.etapes
          )
        ) {
          delete titreDemarche.phase
        }

        acc.push(titreDemarche)
      }
    }

    return acc
  }, [])

export { titreDemarchesEtapesRebuild }
