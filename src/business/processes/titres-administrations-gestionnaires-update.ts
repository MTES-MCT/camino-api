import {
  ITitreAdministrationGestionnaire,
  ITitre,
  IAdministration
} from '../../types'

import PQueue from 'p-queue'

import {
  titresAdministrationsGestionnairesCreate,
  titreAdministrationGestionnaireDelete
} from '../../database/queries/titres'

import titreAdministrationsGestionnairesBuild from '../rules/titre-administrations-gestionnaires-build'

const titreAsGsToCreatedFind = (
  titreAsGsOldIds: string[],
  titreAsGs: ITitreAdministrationGestionnaire[]
) =>
  titreAsGs.reduce(
    (
      titresAsGsToCreate: ITitreAdministrationGestionnaire[],
      titreAdministrationGestionnaire
    ) => {
      if (
        !titreAsGsOldIds.some(
          id => id === titreAdministrationGestionnaire.administrationId
        )
      ) {
        titresAsGsToCreate.push(titreAdministrationGestionnaire)
      }

      return titresAsGsToCreate
    },
    []
  )

const titreAsGsToDeleteFind = (
  titreAsGsOldIds: string[],
  titreAsGs: ITitreAdministrationGestionnaire[],
  titreId: string
) =>
  titreAsGsOldIds.reduce(
    (titreAsGsToDelete: ITitreAdministrationGestionnaire[], id) => {
      if (!titreAsGs.find(({ administrationId }) => administrationId === id)) {
        titreAsGsToDelete.push({
          titreId,
          administrationId: id
        })
      }

      return titreAsGsToDelete
    },
    []
  )

interface ITitresAsGsToUpdate {
  titreAsGsOldIds: string[]
  titreAsGs: ITitreAdministrationGestionnaire[]
  titreId: string
}

const titresAsGsToUpdateBuild = (
  titres: ITitre[],
  administrations: IAdministration[]
) =>
  titres.reduce((titresAsGsToUpdate: ITitresAsGsToUpdate[], titre) => {
    const titreAsGs = titreAdministrationsGestionnairesBuild(
      titre,
      administrations
    )

    const titreAsGsToUpdate = {
      titreAsGsOldIds: titre.administrationsGestionnaires
        ? titre.administrationsGestionnaires.map(({ id }) => id)
        : [],
      titreAsGs,
      titreId: titre.id
    }

    titresAsGsToUpdate.push(titreAsGsToUpdate)

    return titresAsGsToUpdate
  }, [])

const titresAsGsToCreateAndDeleteBuild = (
  titres: ITitre[],
  administrations: IAdministration[]
) =>
  titresAsGsToUpdateBuild(titres, administrations).reduce(
    (
      {
        titresAsGsToCreate,
        titresAsGsToDelete
      }: {
        titresAsGsToCreate: ITitreAdministrationGestionnaire[]
        titresAsGsToDelete: ITitreAdministrationGestionnaire[]
      },
      { titreAsGsOldIds, titreAsGs, titreId }
    ) => {
      titresAsGsToCreate.push(
        ...titreAsGsToCreatedFind(titreAsGsOldIds, titreAsGs)
      )

      titresAsGsToDelete.push(
        ...titreAsGsToDeleteFind(titreAsGsOldIds, titreAsGs, titreId)
      )

      return { titresAsGsToCreate, titresAsGsToDelete }
    },
    {
      titresAsGsToCreate: [],
      titresAsGsToDelete: []
    }
  )

const titresAdministrationsGestionnairesUpdate = async (
  titres: ITitre[],
  administrations: IAdministration[]
) => {
  const {
    titresAsGsToCreate,
    titresAsGsToDelete
  } = titresAsGsToCreateAndDeleteBuild(titres, administrations)

  let titresAsGsCreated = [] as ITitreAdministrationGestionnaire[]
  const titresAsGsDeleted = [] as string[]

  if (titresAsGsToCreate.length) {
    titresAsGsCreated = await titresAdministrationsGestionnairesCreate(
      titresAsGsToCreate
    )

    console.info(
      `mise à jour: étape administrations ${titresAsGsCreated
        .map(tea => JSON.stringify(tea))
        .join(', ')}`
    )
  }

  if (titresAsGsToDelete.length) {
    const queue = new PQueue({ concurrency: 100 })

    titresAsGsToDelete.reduce(
      (titresAsGsDeleted: string[], { titreId, administrationId }) => {
        queue.add(async () => {
          await titreAdministrationGestionnaireDelete(titreId, administrationId)

          console.info(
            `suppression: étape ${titreId}, administration ${administrationId}`
          )

          titresAsGsDeleted.push(titreId)
        })

        return titresAsGsDeleted
      },
      titresAsGsDeleted
    )

    await queue.onIdle()
  }

  return {
    titresAdministrationsGestionnairesCreated: titresAsGsCreated,
    titresAdministrationsGestionnairesDeleted: titresAsGsDeleted
  }
}

export default titresAdministrationsGestionnairesUpdate
