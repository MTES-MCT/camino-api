import {
  ITitreAdministrationsGestionnaire,
  ITitre,
  IAdministration
} from '../../types'

import PQueue from 'p-queue'

import {
  titresAdministrationsGestionnairesCreate,
  titreAdministrationGestionnaireDelete
} from '../../database/queries/titres'

import titreAdministrationsGestionnairesBuild from '../rules/titre-administrations-gestionnaires-build'

const titreAdministrationsGestionnairesToCreatedFind = (
  titreAdministrationsGestionnairesOldIds: string[],
  titreAdministrationsGestionnaires: ITitreAdministrationsGestionnaire[]
) =>
  titreAdministrationsGestionnaires.reduce(
    (
      titresAdministrationsGestionnairesToCreate: ITitreAdministrationsGestionnaire[],
      titreAdministrationGestionnaire
    ) => {
      if (
        !titreAdministrationsGestionnairesOldIds.some(
          id => id === titreAdministrationGestionnaire.administrationId
        )
      ) {
        titresAdministrationsGestionnairesToCreate.push(
          titreAdministrationGestionnaire
        )
      }

      return titresAdministrationsGestionnairesToCreate
    },
    []
  )

const titreAdministrationsGestionnairesToDeleteFind = (
  titreAdministrationsGestionnairesOldIds: string[],
  titreAdministrationsGestionnaires: ITitreAdministrationsGestionnaire[],
  titreId: string
) =>
  titreAdministrationsGestionnairesOldIds.reduce(
    (
      titreAdministrationsGestionnairesToDelete: ITitreAdministrationsGestionnaire[],
      id
    ) => {
      if (
        !titreAdministrationsGestionnaires.find(
          ({ administrationId }) => administrationId === id
        )
      ) {
        titreAdministrationsGestionnairesToDelete.push({
          titreId,
          administrationId: id
        })
      }

      return titreAdministrationsGestionnairesToDelete
    },
    []
  )

const titresAdministrationsGestionnairesToCreateAndDeleteBuild = (
  titres: ITitre[],
  administrations: IAdministration[]
) =>
  titresAdministrationsGestionnairesToUpdateBuild(
    titres,
    administrations
  ).reduce(
    (
      {
        titresAdministrationsGestionnairesToCreate,
        titresAdministrationsGestionnairesToDelete
      }: {
        titresAdministrationsGestionnairesToCreate: ITitreAdministrationsGestionnaire[]
        titresAdministrationsGestionnairesToDelete: ITitreAdministrationsGestionnaire[]
      },
      {
        titreAdministrationsGestionnairesOldIds,
        titreAdministrationsGestionnaires,
        titreId
      }
    ) => {
      titresAdministrationsGestionnairesToCreate.push(
        ...titreAdministrationsGestionnairesToCreatedFind(
          titreAdministrationsGestionnairesOldIds,
          titreAdministrationsGestionnaires
        )
      )

      titresAdministrationsGestionnairesToDelete.push(
        ...titreAdministrationsGestionnairesToDeleteFind(
          titreAdministrationsGestionnairesOldIds,
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

interface ITitresAdministrationsGestionnairesToUpdate {
  titreAdministrationsGestionnairesOldIds: string[]
  titreAdministrationsGestionnaires: ITitreAdministrationsGestionnaire[]
  titreId: string
}

const titresAdministrationsGestionnairesToUpdateBuild = (
  titres: ITitre[],
  administrations: IAdministration[]
) =>
  titres.reduce(
    (
      titresAdministrationsGestionnairesToUpdate: ITitresAdministrationsGestionnairesToUpdate[],
      titre
    ) => {
      const titreAdministrationsGestionnaires = titreAdministrationsGestionnairesBuild(
        titre,
        administrations
      )

      const titreAdministrationsGestionnairesToUpdate = {
        titreAdministrationsGestionnairesOldIds: titre.administrationsGestionnaires
          ? titre.administrationsGestionnaires.map(({ id }) => id)
          : [],
        titreAdministrationsGestionnaires,
        titreId: titre.id
      }

      titresAdministrationsGestionnairesToUpdate.push(
        titreAdministrationsGestionnairesToUpdate
      )

      return titresAdministrationsGestionnairesToUpdate
    },
    []
  )

const titresAdministrationsGestionnairesUpdate = async (
  titres: ITitre[],
  administrations: IAdministration[]
) => {
  const {
    titresAdministrationsGestionnairesToCreate,
    titresAdministrationsGestionnairesToDelete
  } = titresAdministrationsGestionnairesToCreateAndDeleteBuild(
    titres,
    administrations
  )

  let titresAdministrationsGestionnairesCreated = [] as ITitreAdministrationsGestionnaire[]
  const titresAdministrationsGestionnairesDeleted = [] as string[]

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
        titresAdministrationsGestionnairesDeleted: string[],
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

  return {
    titresAdministrationsGestionnairesCreated,
    titresAdministrationsGestionnairesDeleted
  }
}

export default titresAdministrationsGestionnairesUpdate
