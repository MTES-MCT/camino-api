import { ITitresActivites } from '../types'

import { titreActivitesRowUpdate } from '../tools/export/titre-activites'
import { titresGet, titreGet } from '../database/queries/titres'

interface ITitreIndex {
  [key: string]: string
}

const titreActivitesRowsUpdate = async (
  titresActivitesCreated: ITitresActivites[],
  titreUpdatedIndex: ITitreIndex | null
) => {
  let titresIdsUpdatedIndex
  if (titreUpdatedIndex) {
    const titreId = Object.keys(titreUpdatedIndex)[0]
    const titre = await titreGet(titreId)

    if (
      titre &&
      titreId !== titreUpdatedIndex[titreId] &&
      titre.activites?.length
    ) {
      titresActivitesCreated = titre.activites
      titresIdsUpdatedIndex = { [titreId]: titre.id }
    }
  }

  await titreActivitesRowUpdate(titresActivitesCreated, titresIdsUpdatedIndex)
}

const titresActivitesRowsUpdate = async (
  titresActivitesCreated: ITitresActivites[],
  titresUpdatedIndex: ITitreIndex
) => {
  // ne filtre que les titres dont les ids ont changé
  const titresIdsUpdatedIndex = Object.keys(titresUpdatedIndex).reduce(
    (titresIdsUpdatedIndex, titreId) => {
      if (titresUpdatedIndex[titreId] !== titreId) {
        titresIdsUpdatedIndex[titreId] = titresUpdatedIndex[titreId]
      }

      return titresIdsUpdatedIndex
    },
    {} as ITitreIndex
  )

  const titres = await titresGet({
    ids: Object.keys(titresIdsUpdatedIndex)
  })

  const titresActivitesUpdated = titres.reduce(
    (titresActivites: ITitresActivites[], titre) => {
      if (titre.activites?.length) {
        titresActivites.push(...titre.activites)
      }

      return titresActivites
    },
    []
  )

  if (Object.keys(titresIdsUpdatedIndex).length) {
    const titresOldIdsIndex = Object.keys(titresIdsUpdatedIndex).reduce(
      (acc: ITitreIndex, titreOldId: string) => {
        const titreNewId = titresIdsUpdatedIndex[titreOldId]

        if (titreNewId) {
          acc[titreNewId] = titreOldId
        }

        return acc
      },
      {}
    )

    titresActivitesCreated = titresActivitesCreated.filter(
      (tac: ITitresActivites) => !titresOldIdsIndex[tac.titreId]
    )
  }

  await titreActivitesRowUpdate(
    [...titresActivitesCreated, ...titresActivitesUpdated],
    titresIdsUpdatedIndex
  )
}

export { titresActivitesRowsUpdate, titreActivitesRowsUpdate }
