import { ITitreActivite } from '../types'

import { titreActivitesRowUpdate } from '../tools/export/titre-activites'
import { titresGet, titreGet } from '../database/queries/titres'

interface ITitreIndex {
  [key: string]: string
}

const titreActivitesRowsUpdate = async (
  titreActivitesCreated: ITitreActivite[],
  titreUpdatedIndex: ITitreIndex | null
) => {
  let titresIdsUpdatedIndex

  let titreActivitesToUpdate = titreActivitesCreated

  // vérifie si le titre a changé d'id
  if (titreUpdatedIndex) {
    const titreId = Object.keys(titreUpdatedIndex)[0]
    const titre = await titreGet(
      titreId,
      { fields: { activites: { id: {} } } },
      'super'
    )

    // si le titre existe
    // - et qu'il a changé d'id
    // - et qu'il a des activités
    // alors on met à jour toutes ses activités dans la spreadsheet
    if (
      titre &&
      titreId !== titreUpdatedIndex[titreId] &&
      titre.activites?.length
    ) {
      titreActivitesToUpdate = titre.activites
      titresIdsUpdatedIndex = { [titreId]: titre.id }
    }
  }

  await titreActivitesRowUpdate(titreActivitesToUpdate, titresIdsUpdatedIndex)
}

const titresActivitesRowsUpdate = async (
  titresActivitesCreated: ITitreActivite[],
  titresUpdatedOldIdsIndex: ITitreIndex
) => {
  // filtre les ids de titres qui ont changé
  const titresIdsUpdatedIndex = Object.keys(titresUpdatedOldIdsIndex).reduce(
    (titresIdsUpdatedIndex, titreId) => {
      const titreOldId = titresUpdatedOldIdsIndex[titreId]

      if (titreOldId !== titreId) {
        titresIdsUpdatedIndex[titreId] = titreOldId
      }

      return titresIdsUpdatedIndex
    },
    {} as ITitreIndex
  )

  let titresActivitesUpdated = [] as ITitreActivite[]

  const ids = Object.keys(titresIdsUpdatedIndex)

  // si des titres ont changé d'id
  if (ids.length) {
    const titres = await titresGet(
      { ids },
      { fields: { activites: { id: {} } } },
      'super'
    )

    // compile la liste des activités dont le titre a changé d'id
    // à mettre à jour dans les spreadsheets
    titresActivitesUpdated = titres.reduce(
      (titresActivites: ITitreActivite[], titre) => {
        if (titre.activites?.length) {
          titresActivites.push(...titre.activites)
        }

        return titresActivites
      },
      []
    )

    const titresOldIdsIndex = ids.reduce(
      (acc: ITitreIndex, titreOldId: string) => {
        const titreNewId = titresIdsUpdatedIndex[titreOldId]

        if (titreNewId) {
          acc[titreNewId] = titreOldId
        }

        return acc
      },
      {}
    )

    // supprime les activités crées dont l'id de titre a changé
    // elles seront mises à jour grâce à `titresActivitesUpdated`
    titresActivitesCreated = titresActivitesCreated.filter(
      (tac: ITitreActivite) => !titresOldIdsIndex[tac.titreId]
    )
  }

  const titresActivitesToUpdate = [
    ...titresActivitesCreated,
    ...titresActivitesUpdated
  ]

  await titreActivitesRowUpdate(titresActivitesToUpdate, titresIdsUpdatedIndex)
}

export { titresActivitesRowsUpdate, titreActivitesRowsUpdate }
