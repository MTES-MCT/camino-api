import PQueue from 'p-queue'

import {
  titresEtapesAdministrationsCreate,
  titreEtapeAdministrationDelete
} from '../../database/queries/titres-etapes'

// liste des types de titres pour lesquels les administrations locales ne sont pas subsidiaires
// i.e. : Les administrations locales ne seront pas subsidiaires sur les types de titres listés
const administrationsLocalesTypesExceptionsSubsidiaire = {
  'ope-onf-973-01': ['arm']
}

// liste des types de titres pour lesquels uniquement les administrations locales listées sont décideurs
// i.e. : Seules ces administrations locales ne seront pas subsidiaires
//        et toutes les autres administrations locales seront subsidiaires.
//        Les administrations locales des types de titres non listées ne seront pas subsidiaires.
const typesAdministrationsLocalesDecideurExclusif = {
  arm: ['ope-onf-973-01']
}

const titreEtapeAdministrationsLocalesCreatedBuild = (
  titreEtapeAdministrationsLocalesOld,
  titreEtapeAdministrationsLocales
) =>
  titreEtapeAdministrationsLocales.reduce(
    (queries, titreEtapeAdministrationCentrale) => {
      if (
        !titreEtapeAdministrationsLocalesOld ||
        !titreEtapeAdministrationsLocalesOld.find(
          ({ id: idOld }) =>
            idOld === titreEtapeAdministrationCentrale.administrationId
        )
      ) {
        queries.push(titreEtapeAdministrationCentrale)
      }

      return queries
    },
    []
  )

const titreEtapeAdministrationsLocalesDeleteBuild = (
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
        titreId
      }
    ) => {
      titresEtapesAdministrationsLocalesToCreate.push(
        ...titreEtapeAdministrationsLocalesCreatedBuild(
          titreEtapeAdministrationsLocalesOld,
          titreEtapeAdministrationsLocales
        )
      )

      titresEtapesAdministrationsLocalesToDelete.push(
        ...titreEtapeAdministrationsLocalesDeleteBuild(
          titreEtapeAdministrationsLocalesOld,
          titreEtapeAdministrationsLocales,
          titreId
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
  { typeId },
  titreEtape,
  administrations
) => {
  if (!titreEtape.communes || !titreEtape.communes.length) return []

  const {
    titreDepartementsIds,
    titreRegionsIds
  } = titreEtapeAdministrationsRegionsAndDepartementsBuild(titreEtape)

  const administrationsLocalesDecideursExclusif =
    typesAdministrationsLocalesDecideurExclusif[typeId]

  // calcule toutes les administrations qui couvrent ces départements et régions
  return administrations.reduce((titreEtapeAdministrations, administration) => {
    // si le département ou la région de l'administration ne fait pas partie de ceux de l'étape
    const isAdministrationLocale =
      (administration.departementId &&
        titreDepartementsIds.has(administration.departementId)) ||
      (administration.regionId && titreRegionsIds.has(administration.regionId))
    // alors l'administration n'est pas rattachée à l'étape
    if (!isAdministrationLocale) return titreEtapeAdministrations

    // s'il y a une liste de décideurs locaux exclusifs pour ce type de titre
    const subsidiaire = Array.isArray(administrationsLocalesDecideursExclusif)
      ? // vérifie que l'administration locale n'est pas dans la liste
        !administrationsLocalesDecideursExclusif.includes(administration.id)
      : // s'il y a une liste de titres uniquement pour lesquels l'administration n'est pas subsidiaire
      Array.isArray(
          administrationsLocalesTypesExceptionsSubsidiaire[administration.id]
        )
      ? // vérifie si l'administration locale n'est pas dans la liste
        !administrationsLocalesTypesExceptionsSubsidiaire[
          administration.id
        ].includes(typeId)
      : false

    const titreEtapeAdministration = {
      titreEtapeId: titreEtape.id,
      administrationId: administration.id,
      subsidiaire
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
                titre,
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
