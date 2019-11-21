import PQueue from 'p-queue'

import {
  titresAdministrationsGestionnairesCreate,
  titreAdministrationGestionnaireDelete
} from '../../database/queries/titres'

import titreAdministrationsGestionnairesBuild from '../rules/titre-administrations-gestionnaires-build'

const titreAdministrationsGestionnairesCreatedBuild = (
  titreAdministrationsGestionnairesOld,
  titreAdministrationsGestionnaires
) =>
  titreAdministrationsGestionnaires.reduce(
    (queries, titreAdministrationGestionnaire) => {
      if (
        !titreAdministrationsGestionnairesOld ||
        !titreAdministrationsGestionnairesOld.find(
          ({ id: idOld }) =>
            idOld === titreAdministrationGestionnaire.administrationId
        )
      ) {
        queries.push(titreAdministrationGestionnaire)
      }

      return queries
    },
    []
  )

const titreAdministrationsGestionnairesDeleteBuild = (
  titreAdministrationsGestionnairesOld,
  titreAdministrationsGestionnaires,
  titreId
) =>
  titreAdministrationsGestionnairesOld
    ? titreAdministrationsGestionnairesOld.reduce((queries, { id: idOld }) => {
        if (
          !titreAdministrationsGestionnaires.find(
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

const titresAdministrationsGestionnairesToCreateAndDeleteBuild = titresAdministrationsGestionnaires =>
  Object.values(titresAdministrationsGestionnaires).reduce(
    (
      {
        titresAdministrationsGestionnairesToCreate,
        titresAdministrationsGestionnairesToDelete
      },
      {
        titreAdministrationsGestionnairesOld,
        titreAdministrationsGestionnaires,
        titreId
      }
    ) => {
      titresAdministrationsGestionnairesToCreate.push(
        ...titreAdministrationsGestionnairesCreatedBuild(
          titreAdministrationsGestionnairesOld,
          titreAdministrationsGestionnaires
        )
      )

      titresAdministrationsGestionnairesToDelete.push(
        ...titreAdministrationsGestionnairesDeleteBuild(
          titreAdministrationsGestionnairesOld,
          titreAdministrationsGestionnaires,
          titreId
        )
      )

      return {
        titresAdministrationsGestionnairesToCreate,
        titresAdministrationsGestionnairesToDelete
      }
    },
    {
      titresAdministrationsGestionnairesToCreate: [],
      titresAdministrationsGestionnairesToDelete: []
    }
  )

const titresAdministrationsGestionnairesBuild = (titres, administrations) =>
  titres.reduce((titresAdministrationsGestionnaires, titre) => {
    const titreAdministrationsGestionnaires = titreAdministrationsGestionnairesBuild(
      titre,
      administrations
    )

    titresAdministrationsGestionnaires.push({
      titreAdministrationsGestionnairesOld: titre.administrationsGestionnaires,
      titreAdministrationsGestionnaires,
      titreId: titre.id
    })

    return titresAdministrationsGestionnaires
  }, [])

const titresAdministrationsGestionnairesUpdate = async (
  titres,
  administrations
) => {
  // parcourt les étapes à partir des titres
  // car on a besoin de titre.domaineId
  const titresAdministrationsGestionnaires = titresAdministrationsGestionnairesBuild(
    titres,
    administrations
  )

  const {
    titresAdministrationsGestionnairesToCreate,
    titresAdministrationsGestionnairesToDelete
  } = titresAdministrationsGestionnairesToCreateAndDeleteBuild(
    titresAdministrationsGestionnaires
  )

  let titresAdministrationsGestionnairesCreated = []
  const titresAdministrationsGestionnairesDeleted = []

  if (titresAdministrationsGestionnairesToCreate.length) {
    titresAdministrationsGestionnairesCreated = await titresAdministrationsGestionnairesCreate(
      titresAdministrationsGestionnairesToCreate
    )

    console.log(
      `mise à jour: étape administrations ${titresAdministrationsGestionnairesCreated
        .map(tea => JSON.stringify(tea))
        .join(', ')}`
    )
  }

  if (titresAdministrationsGestionnairesToDelete.length) {
    const queue = new PQueue({ concurrency: 100 })

    titresAdministrationsGestionnairesToDelete.reduce(
      (
        titresAdministrationsGestionnairesDeleted,
        { titreId, administrationId }
      ) => {
        queue.add(async () => {
          await titreAdministrationGestionnaireDelete(titreId, administrationId)

          console.log(
            `suppression: étape ${titreId}, administration ${administrationId}`
          )

          titresAdministrationsGestionnairesDeleted.push(titreId)
        })

        return titresAdministrationsGestionnairesDeleted
      },
      titresAdministrationsGestionnairesDeleted
    )

    await queue.onIdle()
  }

  return [
    titresAdministrationsGestionnairesCreated,
    titresAdministrationsGestionnairesDeleted
  ]
}

export default titresAdministrationsGestionnairesUpdate
