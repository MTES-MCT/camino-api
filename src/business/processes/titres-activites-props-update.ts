import { ITitreActivite } from '../../types'
import * as dateFormat from 'dateformat'

import { activiteTypeAnneesFind } from '../utils/activite-type-annees-find'
import { titresActivitesUpsert } from '../../database/queries/titres-activites'
import { titreActiviteIsValideCheck } from '../rules/titre-activites-build'
import { titresGet } from '../../database/queries/titres'

const titresActivitesPropsUpdate = async (titresIds?: string[]) => {
  console.info()
  console.info('propriétés des activités de titres…')

  const titres = await titresGet(
    { ids: titresIds },
    {
      fields: {
        demarches: { phase: { id: {} } },
        activites: { type: { frequence: { id: {} } } }
      }
    },
    'super'
  )

  const aujourdhui = dateFormat(new Date(), 'yyyy-mm-dd')
  const annee = new Date().getFullYear()

  const titresActivitesUpdated = titres.reduce(
    (acc: ITitreActivite[], titre) => {
      if (!titre.activites?.length || !titre.demarches?.length) return acc

      return titre.activites.reduce((acc, titreActivite) => {
        const activiteType = titreActivite.type!
        const annees = activiteTypeAnneesFind(activiteType, annee)

        if (!annees.length) return acc

        const periodes = activiteType.frequence![
          activiteType.frequence!.periodesNom!
        ]!
        const months = 12 / periodes.length

        const activiteIsValide = titreActiviteIsValideCheck(
          titreActivite.date,
          aujourdhui,
          titreActivite.periodeId,
          annee,
          months,
          titre.demarches!
        )

        if (activiteIsValide && titreActivite.suppression) {
          titreActivite.suppression = null

          acc.push(titreActivite)
        }

        if (!activiteIsValide && !titreActivite.suppression) {
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
