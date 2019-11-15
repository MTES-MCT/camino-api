import PQueue from 'p-queue'

import {
  titresAdministrationsCentralesCreate,
  titreAdministrationCentraleDelete
} from '../../database/queries/titres'

import titreAdministrationsCentralesBuild from '../rules/titre-administrations-centrales-build'

const titreAdministrationsCentralesCreatedBuild = (
  titreAdministrationsCentralesOld,
  titreAdministrationsCentrales
) =>
  titreAdministrationsCentrales.reduce(
    (queries, titreAdministrationCentrale) => {
      if (
        !titreAdministrationsCentralesOld ||
        !titreAdministrationsCentralesOld.find(
          ({ id: idOld }) =>
            idOld === titreAdministrationCentrale.administrationId
        )
      ) {
        queries.push(titreAdministrationCentrale)
      }

      return queries
    },
    []
  )

const titreAdministrationsCentralesDeleteBuild = (
  titreAdministrationsCentralesOld,
  titreAdministrationsCentrales,
  titreId
) =>
  titreAdministrationsCentralesOld
    ? titreAdministrationsCentralesOld.reduce((queries, { id: idOld }) => {
        if (
          !titreAdministrationsCentrales.find(
            ({ administrationId: idNew }) => idNew === idOld
          )
        ) {
          queries.push({
            titreId,
            administrationId: idOld
          })
        }

        return queries
      }, [])
    : []

const titresAdministrationsCentralesToCreateAndDeleteBuild = titresAdministrationsCentrales =>
  Object.values(titresAdministrationsCentrales).reduce(
    (
      {
        titresAdministrationsCentralesToCreate,
        titresAdministrationsCentralesToDelete
      },
      {
        titreAdministrationsCentralesOld,
        titreAdministrationsCentrales,
        titreId
      }
    ) => {
      titresAdministrationsCentralesToCreate.push(
        ...titreAdministrationsCentralesCreatedBuild(
          titreAdministrationsCentralesOld,
          titreAdministrationsCentrales
        )
      )

      titresAdministrationsCentralesToDelete.push(
        ...titreAdministrationsCentralesDeleteBuild(
          titreAdministrationsCentralesOld,
          titreAdministrationsCentrales,
          titreId
        )
      )

      return {
        titresAdministrationsCentralesToCreate,
        titresAdministrationsCentralesToDelete
      }
    },
    {
      titresAdministrationsCentralesToCreate: [],
      titresAdministrationsCentralesToDelete: []
    }
  )

const titresAdministrationsCentralesBuild = (titres, administrations) =>
  titres.reduce((titresAdministrationsCentrales, titre) => {
    const titreAdministrationsCentrales = titreAdministrationsCentralesBuild(
      titre,
      administrations
    )

    titresAdministrationsCentrales.push({
      titreAdministrationsCentralesOld: titre.administrationsCentrales,
      titreAdministrationsCentrales,
      titreId: titre.id
    })

    return titresAdministrationsCentrales
  }, [])

const titresAdministrationsCentralesUpdate = async (
  titres,
  administrations
) => {
  // parcourt les étapes à partir des titres
  // car on a besoin de titre.domaineId
  const titresAdministrationsCentrales = titresAdministrationsCentralesBuild(
    titres,
    administrations
  )

  const {
    titresAdministrationsCentralesToCreate,
    titresAdministrationsCentralesToDelete
  } = titresAdministrationsCentralesToCreateAndDeleteBuild(
    titresAdministrationsCentrales
  )

  let titresAdministrationsCentralesCreated = []
  const titresAdministrationsCentralesDeleted = []

  if (titresAdministrationsCentralesToCreate.length) {
    titresAdministrationsCentralesCreated = await titresAdministrationsCentralesCreate(
      titresAdministrationsCentralesToCreate
    )

    console.log(
      `mise à jour: étape administrations ${titresAdministrationsCentralesCreated
        .map(tea => JSON.stringify(tea))
        .join(', ')}`
    )
  }

  if (titresAdministrationsCentralesToDelete.length) {
    const queue = new PQueue({ concurrency: 100 })

    titresAdministrationsCentralesToDelete.reduce(
      (
        titresAdministrationsCentralesDeleted,
        { titreId, administrationId }
      ) => {
        queue.add(async () => {
          await titreAdministrationCentraleDelete(titreId, administrationId)

          console.log(
            `suppression: étape ${titreId}, administration ${administrationId}`
          )

          titresAdministrationsCentralesDeleted.push(titreId)
        })

        return titresAdministrationsCentralesDeleted
      },
      titresAdministrationsCentralesDeleted
    )

    await queue.onIdle()
  }

  return [
    titresAdministrationsCentralesCreated,
    titresAdministrationsCentralesDeleted
  ]
}

export default titresAdministrationsCentralesUpdate
