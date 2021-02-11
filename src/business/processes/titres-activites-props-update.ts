import { ITitreActivite } from '../../types'
import * as dateFormat from 'dateformat'

import { titresActivitesUpsert } from '../../database/queries/titres-activites'
import { titresGet } from '../../database/queries/titres'
import { titreValideCheck } from '../utils/titre-valide-check'

const titresActivitesPropsUpdate = async (titresIds?: string[]) => {
  console.info()
  console.info('propriétés des activités de titres…')

  const titres = await titresGet(
    { ids: titresIds },
    {
      fields: {
        demarches: { phase: { id: {} }, etapes: { id: {} } },
        activites: {
          type: {
            frequence: {
              mois: { id: {} },
              trimestres: { id: {} },
              annees: { id: {} }
            }
          }
        }
      }
    },
    'super'
  )

  const titresActivitesUpdated = titres.reduce(
    (acc: ITitreActivite[], titre) => {
      if (!titre.activites?.length) return acc

      return titre.activites.reduce((acc, titreActivite) => {
        const activiteType = titreActivite.type!
        const periodes = activiteType.frequence![
          activiteType.frequence!.periodesNom!
        ]!

        const periodeMonths = 12 / periodes.length
        const dateDebut = dateFormat(
          new Date(
            titreActivite.annee,
            (titreActivite.periodeId - 1) * periodeMonths,
            1
          ),
          'yyyy-mm-dd'
        )

        const titreIsValide =
          titre.demarches?.length &&
          titreValideCheck(
            titre.demarches!,
            dateDebut,
            titreActivite.date,
            titre.typeId
          )

        if (titreIsValide && titreActivite.suppression) {
          titreActivite.suppression = null

          acc.push(titreActivite)
        }

        if (!titreIsValide && !titreActivite.suppression) {
          titreActivite.suppression = true

          acc.push(titreActivite)
        }

        return acc
      }, acc)
    },
    []
  )

  if (titresActivitesUpdated.length) {
    await titresActivitesUpsert(titresActivitesUpdated)

    const log = {
      type: 'titre / activités / propriétés (mise à jour) ->',
      value: titresActivitesUpdated.map(ta => ta.id).join(', ')
    }

    console.info(log.type, log.value)
  }

  return titresActivitesUpdated.map(ta => ta.id)
}

export { titresActivitesPropsUpdate }
