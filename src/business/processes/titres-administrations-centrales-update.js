import PQueue from 'p-queue'

import {
  titresAdministrationsCentralesCreate,
  titreAdministrationCentraleDelete
} from '../../database/queries/titres'

// administrations restreintes à certains types types de titres
const administrationsTypesRestrictions = {
  'ope-ptmg-973-01': ['arm'],
  'ope-onf-973-01': ['arm'],
  'dea-guyane-01': ['axm']
}

// administrations subsidiaires sur certains types de titres
const administrationsTypesSubsidiaires = {
  'dea-guyane-01': ['arm'],
  'ope-ptmg-973-01': ['arm'],
  'min-mtes-dgaln-01': ['arm', 'axm']
}

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

const titreAdministrationsCentralesBuild = (
  { id: titreId, domaineId, typeId },
  administrations
) =>
  administrations.reduce((titreAdministrationsCentrales, administration) => {
    const isTitreAdministration =
      administration.domaines &&
      administration.domaines.length &&
      administration.domaines.find(({ id }) => id === domaineId)

    if (!isTitreAdministration) return titreAdministrationsCentrales

    const typesRestrictions =
      administrationsTypesRestrictions[administration.id]

    // si
    // - il y a des restrictions pour cette administration centrale
    // - le type de titre n'est pas trouvé parmi les types de titres autorisés
    // l'administration n'est pas rattachée à l'étape
    if (typesRestrictions && !typesRestrictions.includes(typeId)) {
      return titreAdministrationsCentrales
    }

    const subsidiaire =
      administrationsTypesSubsidiaires[administration.id] &&
      administrationsTypesSubsidiaires[administration.id].includes(typeId)

    const titreAdministrationCentrale = {
      titreId,
      administrationId: administration.id
    }

    if (subsidiaire) {
      titreAdministrationCentrale.subsidiaire = subsidiaire
    }

    titreAdministrationsCentrales.push(titreAdministrationCentrale)

    return titreAdministrationsCentrales
  }, [])

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
