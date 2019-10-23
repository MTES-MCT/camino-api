import PQueue from 'p-queue'

import {
  titresAdministrationsCentralesCreate,
  titreAdministrationCentraleDelete
} from '../../database/queries/titres'

// liste des types de titres pour lesquels les administrations centrales font exception
// i.e. : Ces administrations centrales ne seront ajoutées qu'aux types listés.
const administrationsCentralesTypesExceptionsLink = {
  'ope-ptmg-973-01': ['arm']
}

// liste des types de titres pour lesquels les administrations centrales sont subsidiaires
// i.e. : Les administrations centrales seront subsidiaires pour ces types de titres.
const typesAdministrationsCentralesSubsidiaire = ['axm', 'arm']

const titreAdministrationsCentralesCreatedBuild = (
  titre,
  titreAdministrationsCentrales
) =>
  titreAdministrationsCentrales.reduce((queries, administration) => {
    if (
      !titre.administrationsCentrales ||
      !titre.administrationsCentrales.find(
        administrationOld =>
          administrationOld.id === administration.administrationId
      )
    ) {
      queries.push({
        titreId: titre.id,
        ...administration
      })
    }

    return queries
  }, [])

const titreAdministrationsCentralesDeleteBuild = (
  titre,
  titreAdministrationsCentrales
) =>
  titre.administrationsCentrales
    ? titre.administrationsCentrales.reduce((queries, administrationOld) => {
        if (
          !titreAdministrationsCentrales.find(
            administration =>
              administration.administrationId === administrationOld.id
          )
        ) {
          queries.push({
            titreId: titre.id,
            administrationId: administrationOld.id
          })
        }

        return queries
      }, [])
    : []

const titreAdministrationsCentralesBuild = (
  { domaineId, typeId },
  administrations
) =>
  administrations.reduce((titreAdministrationsCentrales, administration) => {
    const isTitreAdministration =
      administration.domaines &&
      administration.domaines.length &&
      administration.domaines.find(({ id }) => id === domaineId)
    if (!isTitreAdministration) return titreAdministrationsCentrales

    const administrationsCentraleExceptionLink =
      administrationsCentralesTypesExceptionsLink[administration.id]
    if (
      // s'il y a une exception de lien pour cette administration centrale
      administrationsCentraleExceptionLink &&
      // et que le type de titre n'est pas trouvé parmi les types de titres autorisés
      !administrationsCentraleExceptionLink.includes(typeId)
    ) {
      // alors l'administration n'est pas rattachée à l'étape
      return titreAdministrationsCentrales
    }

    const subsidiaire =
      typesAdministrationsCentralesSubsidiaire.includes(typeId) ||
      !!administrationsCentraleExceptionLink

    const titreAdministrationCentrale = {
      administrationId: administration.id,
      subsidiaire
    }

    titreAdministrationsCentrales.push(titreAdministrationCentrale)

    return titreAdministrationsCentrales
  }, [])

const titresAdministrationsCentralesToCreateAndDeleteBuild = titresAdministrationsCentrales =>
  Object.values(titresAdministrationsCentrales).reduce(
    (
      {
        titresAdministrationsCentralesToCreate,
        titresAdministrationsCentralesToDelete
      },
      { titre, titreAdministrationsCentrales }
    ) => {
      titresAdministrationsCentralesToCreate.push(
        ...titreAdministrationsCentralesCreatedBuild(
          titre,
          titreAdministrationsCentrales
        )
      )

      titresAdministrationsCentralesToDelete.push(
        ...titreAdministrationsCentralesDeleteBuild(
          titre,
          titreAdministrationsCentrales
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

    titresAdministrationsCentrales[titre.id] = {
      titre,
      titreAdministrationsCentrales
    }

    return titresAdministrationsCentrales
  }, {})

const titresAdministrationsCentralesUpdate = async (
  titres,
  administrations
) => {
  // parcourt les étapes à partir des titres
  // car on a besoin de titre.domaineId
  // retourne un dictionnaire { [titreId]: { titre, titreAdministrationsCentrales } }
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
