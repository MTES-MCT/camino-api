import PQueue from 'p-queue'

import {
  titresEtapesAdministrationsCreate,
  titreEtapeAdministrationDelete
} from '../../database/queries/titres-etapes'

// administrations associees sur certains types de titres
// (ces administrations seront associees pour ces types de titres)
const administrationsTypesAssociees = {
  'dea-guyane-01': ['arm'],
  'prefecture-97302-01': ['arm']
}

const titreEtapeAdministrationsLocalesCreatedBuild = (
  titreEtapeAdministrationsLocalesOld,
  titreEtapeAdministrationsLocales
) =>
  titreEtapeAdministrationsLocales.reduce(
    (queries, titreEtapeAdministrationGestionnaire) => {
      if (
        !titreEtapeAdministrationsLocalesOld ||
        !titreEtapeAdministrationsLocalesOld.find(
          ({ id: idOld }) =>
            idOld === titreEtapeAdministrationGestionnaire.administrationId
        )
      ) {
        queries.push(titreEtapeAdministrationGestionnaire)
      }

      return queries
    },
    []
  )

const titreEtapeAdministrationsLocalesToDeleteBuild = (
  titreEtapeAdministrationsLocalesOld,
  titreEtapeAdministrationsLocales,
  titreEtapeId
) =>
  titreEtapeAdministrationsLocalesOld
    ? titreEtapeAdministrationsLocalesOld.reduce((queries, { id: idOld }) => {
        if (
          !titreEtapeAdministrationsLocales.find(
            ({ administrationId: idNew }) => idNew === idOld
          )
        ) {
          queries.push({
            titreEtapeId,
            administrationId: idOld
          })
        }

        return queries
      }, [])
    : []

const titresEtapesAdministrationsLocalesToCreateAndDeleteBuild = titresEtapesAdministrationsLocales =>
  Object.values(titresEtapesAdministrationsLocales).reduce(
    (
      {
        titresEtapesAdministrationsLocalesToCreate,
        titresEtapesAdministrationsLocalesToDelete
      },
      {
        titreEtapeAdministrationsLocalesOld,
        titreEtapeAdministrationsLocales,
        titreEtapeId
      }
    ) => {
      titresEtapesAdministrationsLocalesToCreate.push(
        ...titreEtapeAdministrationsLocalesCreatedBuild(
          titreEtapeAdministrationsLocalesOld,
          titreEtapeAdministrationsLocales
        )
      )

      titresEtapesAdministrationsLocalesToDelete.push(
        ...titreEtapeAdministrationsLocalesToDeleteBuild(
          titreEtapeAdministrationsLocalesOld,
          titreEtapeAdministrationsLocales,
          titreEtapeId
        )
      )

      return {
        titresEtapesAdministrationsLocalesToCreate,
        titresEtapesAdministrationsLocalesToDelete
      }
    },
    {
      titresEtapesAdministrationsLocalesToCreate: [],
      titresEtapesAdministrationsLocalesToDelete: []
    }
  )

// calcule tous les départements et les régions d'une étape
const titreEtapeAdministrationsRegionsAndDepartementsBuild = ({ communes }) =>
  communes.reduce(
    ({ titreDepartementsIds, titreRegionsIds }, commune) => {
      if (commune.departementId) {
        titreDepartementsIds.add(commune.departementId)
      }

      if (commune.departement && commune.departement.regionId) {
        titreRegionsIds.add(commune.departement.regionId)
      }

      return {
        titreDepartementsIds,
        titreRegionsIds
      }
    },
    { titreRegionsIds: new Set(), titreDepartementsIds: new Set() }
  )

const titreEtapeAdministrationsLocalesBuild = (
  titreTypeId,
  titreEtape,
  administrations
) => {
  if (!titreEtape.communes || !titreEtape.communes.length) return []

  const {
    titreDepartementsIds,
    titreRegionsIds
  } = titreEtapeAdministrationsRegionsAndDepartementsBuild(titreEtape)

  // calcule toutes les administrations qui couvrent ces départements et régions
  return administrations.reduce((titreEtapeAdministrations, administration) => {
    // si le département ou la région de l'administration ne fait pas partie de ceux de l'étape
    const isAdministrationLocale =
      (administration.departementId &&
        titreDepartementsIds.has(administration.departementId)) ||
      (administration.regionId && titreRegionsIds.has(administration.regionId))
    // alors l'administration n'est pas rattachée à l'étape
    if (!isAdministrationLocale) return titreEtapeAdministrations

    const titreEtapeAdministration = {
      titreEtapeId: titreEtape.id,
      administrationId: administration.id
    }

    const associee =
      administrationsTypesAssociees[administration.id] &&
      administrationsTypesAssociees[administration.id].includes(titreTypeId)

    if (associee) {
      titreEtapeAdministration.associee = associee
    }

    titreEtapeAdministrations.push(titreEtapeAdministration)

    return titreEtapeAdministrations
  }, [])
}

const titresEtapesAdministrationsLocalesBuild = (titres, administrations) =>
  titres.reduce(
    (titresEtapesAdministrationsLocales, titre) =>
      titre.demarches.reduce(
        (titresEtapesAdministrationsLocales, titreDemarche) =>
          titreDemarche.etapes.reduce(
            (titresEtapesAdministrationsLocales, titreEtape) => {
              const titreEtapeAdministrationsLocales = titreEtapeAdministrationsLocalesBuild(
                titre.typeId,
                titreEtape,
                administrations
              )

              titresEtapesAdministrationsLocales.push({
                titreEtapeAdministrationsLocalesOld: titreEtape.administrations,
                titreEtapeAdministrationsLocales,
                titreEtapeId: titreEtape.id
              })

              return titresEtapesAdministrationsLocales
            },
            titresEtapesAdministrationsLocales
          ),
        titresEtapesAdministrationsLocales
      ),
    []
  )

const titresEtapesAdministrationsLocalesUpdate = async (
  titres,
  administrations
) => {
  // parcourt les étapes à partir des titres
  // car on a besoin de titre.domaineId
  const titresEtapesAdministrationsLocales = titresEtapesAdministrationsLocalesBuild(
    titres,
    administrations
  )

  const {
    titresEtapesAdministrationsLocalesToCreate,
    titresEtapesAdministrationsLocalesToDelete
  } = titresEtapesAdministrationsLocalesToCreateAndDeleteBuild(
    titresEtapesAdministrationsLocales
  )

  let titresEtapesAdministrationsLocalesCreated = []
  const titresEtapesAdministrationsLocalesDeleted = []

  if (titresEtapesAdministrationsLocalesToCreate.length) {
    titresEtapesAdministrationsLocalesCreated = await titresEtapesAdministrationsCreate(
      titresEtapesAdministrationsLocalesToCreate
    )

    console.log(
      `mise à jour: étape administrations ${titresEtapesAdministrationsLocalesCreated
        .map(tea => JSON.stringify(tea))
        .join(', ')}`
    )
  }

  if (titresEtapesAdministrationsLocalesToDelete.length) {
    const queue = new PQueue({ concurrency: 100 })

    titresEtapesAdministrationsLocalesToDelete.reduce(
      (
        titresEtapesAdministrationsLocalesDeleted,
        { titreEtapeId, administrationId }
      ) => {
        queue.add(async () => {
          await titreEtapeAdministrationDelete(titreEtapeId, administrationId)

          console.log(
            `suppression: étape ${titreEtapeId}, administration ${administrationId}`
          )

          titresEtapesAdministrationsLocalesDeleted.push(titreEtapeId)
        })

        return titresEtapesAdministrationsLocalesDeleted
      },
      titresEtapesAdministrationsLocalesDeleted
    )

    await queue.onIdle()
  }

  return [
    titresEtapesAdministrationsLocalesCreated,
    titresEtapesAdministrationsLocalesDeleted
  ]
}

export default titresEtapesAdministrationsLocalesUpdate
