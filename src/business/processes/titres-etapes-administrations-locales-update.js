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

const titreEtapeAdministrationsCreatedBuild = (
  titreEtape,
  titreEtapeAdministrations
) =>
  titreEtapeAdministrations.reduce((queries, administration) => {
    if (
      !titreEtape.administrations ||
      !titreEtape.administrations.find(
        administrationOld =>
          administrationOld.id === administration.administrationId
      )
    ) {
      queries.push({
        titreEtapeId: titreEtape.id,
        ...administration
      })
    }

    return queries
  }, [])

const titreEtapeAdministrationsDeleteBuild = (
  titreEtape,
  titreEtapeAdministrations
) =>
  titreEtape.administrations
    ? titreEtape.administrations.reduce((queries, administrationOld) => {
        if (
          !titreEtapeAdministrations.find(
            administration =>
              administration.administrationId === administrationOld.id
          )
        ) {
          queries.push({
            titreEtapeId: titreEtape.id,
            administrationId: administrationOld.id
          })
        }

        return queries
      }, [])
    : []

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
      administrationId: administration.id,
      subsidiaire
    }

    titreEtapeAdministrations.push(titreEtapeAdministration)

    return titreEtapeAdministrations
  }, [])
}

// retourne un tableau d'ids d'administrations
const titreEtapeAdministrationsBuild = (titre, titreEtape, administrations) => {
  let titreEtapeAdministrationsLocales = new Map()

  if (titreEtape.communes && titreEtape.communes.length) {
    titreEtapeAdministrationsLocales = titreEtapeAdministrationsLocalesBuild(
      titre,
      titreEtape,
      administrations
    )
  }

  return [...titreEtapeAdministrationsLocales.values()]
}

const titresEtapesAdministrationsToCreateAndDeleteBuild = titresEtapesAdministrations =>
  Object.values(titresEtapesAdministrations).reduce(
    (
      {
        titresEtapesAdministrationsToCreate,
        titresEtapesAdministrationsToDelete
      },
      { titreEtape, titreEtapeAdministrations }
    ) => {
      titresEtapesAdministrationsToCreate.push(
        ...titreEtapeAdministrationsCreatedBuild(
          titreEtape,
          titreEtapeAdministrations
        )
      )

      titresEtapesAdministrationsToDelete.push(
        ...titreEtapeAdministrationsDeleteBuild(
          titreEtape,
          titreEtapeAdministrations
        )
      )

      return {
        titresEtapesAdministrationsToCreate,
        titresEtapesAdministrationsToDelete
      }
    },
    {
      titresEtapesAdministrationsToCreate: [],
      titresEtapesAdministrationsToDelete: []
    }
  )

const titresEtapesAdministrationsBuild = (titres, administrations) =>
  titres.reduce(
    (titresEtapesAdministrations, titre) =>
      titre.demarches.reduce(
        (titresEtapesAdministrations, titreDemarche) =>
          titreDemarche.etapes.reduce(
            (titresEtapesAdministrations, titreEtape) => {
              const titreEtapeAdministrations = titreEtapeAdministrationsBuild(
                titre,
                titreEtape,
                administrations
              )

              titresEtapesAdministrations[titreEtape.id] = {
                titreEtape,
                titreEtapeAdministrations
              }

              return titresEtapesAdministrations
            },
            titresEtapesAdministrations
          ),
        titresEtapesAdministrations
      ),
    {}
  )

const titresEtapesAdministrationsUpdate = async (titres, administrations) => {
  // parcourt les étapes à partir des titres
  // car on a besoin de titre.domaineId
  // retourne un dictionnaire { [titreEtapeId]: { titreEtape, titreEtapeAdministrations } }
  const titresEtapesAdministrations = titresEtapesAdministrationsBuild(
    titres,
    administrations
  )

  const {
    titresEtapesAdministrationsToCreate,
    titresEtapesAdministrationsToDelete
  } = titresEtapesAdministrationsToCreateAndDeleteBuild(
    titresEtapesAdministrations
  )

  let titresEtapesAdministrationsCreated = []
  const titresEtapesAdministrationsDeleted = []

  if (titresEtapesAdministrationsToCreate.length) {
    titresEtapesAdministrationsCreated = await titresEtapesAdministrationsCreate(
      titresEtapesAdministrationsToCreate
    )

    console.log(
      `mise à jour: étape administrations ${titresEtapesAdministrationsCreated
        .map(tea => JSON.stringify(tea))
        .join(', ')}`
    )
  }

  if (titresEtapesAdministrationsToDelete.length) {
    const queue = new PQueue({ concurrency: 100 })

    titresEtapesAdministrationsToDelete.reduce(
      (
        titresEtapesAdministrationsDeleted,
        { titreEtapeId, administrationId }
      ) => {
        queue.add(async () => {
          await titreEtapeAdministrationDelete(titreEtapeId, administrationId)

          console.log(
            `suppression: étape ${titreEtapeId}, administration ${administrationId}`
          )

          titresEtapesAdministrationsDeleted.push(titreEtapeId)
        })

        return titresEtapesAdministrationsDeleted
      },
      titresEtapesAdministrationsDeleted
    )

    await queue.onIdle()
  }

  return [
    titresEtapesAdministrationsCreated,
    titresEtapesAdministrationsDeleted
  ]
}

export default titresEtapesAdministrationsUpdate
