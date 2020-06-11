import {
  ITitre,
  IAdministration,
  ITitreAdministrationLocale,
  ITitreEtape,
  ICommune
} from '../../types'

import PQueue from 'p-queue'

import {
  titresEtapesAdministrationsCreate,
  titreEtapeAdministrationDelete
} from '../../database/queries/titres-etapes'

const titreEtapeAdministrationsLocalesCreatedBuild = (
  titreEtapeAdministrationsLocalesOld: IAdministration[] | null | undefined,
  titreEtapeAdministrationsLocales: ITitreAdministrationLocale[]
) =>
  titreEtapeAdministrationsLocales.reduce(
    (
      queries: ITitreAdministrationLocale[],
      titreEtapeAdministrationGestionnaire
    ) => {
      if (
        !titreEtapeAdministrationsLocalesOld ||
        !titreEtapeAdministrationsLocalesOld.find(
          ({ id: idOld, associee }) =>
            idOld === titreEtapeAdministrationGestionnaire.administrationId &&
            associee === titreEtapeAdministrationGestionnaire.associee
        )
      ) {
        queries.push(titreEtapeAdministrationGestionnaire)
      }

      return queries
    },
    []
  )

interface IEtapeAdministrationLocaleToDelete {
  titreEtapeId: string
  administrationId: string
}

const titreEtapeAdministrationsLocalesToDeleteBuild = (
  titreEtapeAdministrationsLocalesOld: IAdministration[] | null | undefined,
  titreEtapeAdministrationsLocales: ITitreAdministrationLocale[],
  titreEtapeId: string
) =>
  titreEtapeAdministrationsLocalesOld
    ? titreEtapeAdministrationsLocalesOld.reduce(
        (
          queries: IEtapeAdministrationLocaleToDelete[],
          { id: idOld, associee: associeeOld }
        ) => {
          if (
            !titreEtapeAdministrationsLocales.find(
              ({ administrationId: idNew, associee: associeeNew }) =>
                idNew === idOld && associeeOld === associeeNew
            )
          ) {
            queries.push({
              titreEtapeId,
              administrationId: idOld
            })
          }

          return queries
        },
        []
      )
    : []

interface ITitreEtapeAdministrationLocale {
  titreEtapeAdministrationsLocalesOld: IAdministration[] | null | undefined
  titreEtapeAdministrationsLocales: ITitreAdministrationLocale[]
  titreEtapeId: string
}

const titresEtapesAdministrationsLocalesToCreateAndDeleteBuild = (
  titresEtapesAdministrationsLocales: ITitreEtapeAdministrationLocale[]
) =>
  Object.values(titresEtapesAdministrationsLocales).reduce(
    (
      {
        titresEtapesAdministrationsLocalesToCreate,
        titresEtapesAdministrationsLocalesToDelete
      }: {
        titresEtapesAdministrationsLocalesToCreate: ITitreAdministrationLocale[]
        titresEtapesAdministrationsLocalesToDelete: IEtapeAdministrationLocaleToDelete[]
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
const titreEtapeAdministrationsRegionsAndDepartementsBuild = (
  communes: ICommune[]
) =>
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
  titreTypeId: string,
  titreEtape: ITitreEtape,
  administrations: IAdministration[]
) => {
  if (!titreEtape.communes || !titreEtape.communes.length) return []

  const {
    titreDepartementsIds,
    titreRegionsIds
  } = titreEtapeAdministrationsRegionsAndDepartementsBuild(titreEtape.communes)

  // calcule toutes les administrations qui couvrent ces départements et régions
  return administrations.reduce(
    (
      titreEtapeAdministrations: ITitreAdministrationLocale[],
      administration: IAdministration
    ) => {
      // si le département ou la région de l'administration ne fait pas partie de ceux de l'étape
      const isAdministrationLocale =
        (administration.departementId &&
          titreDepartementsIds.has(administration.departementId)) ||
        (administration.regionId &&
          titreRegionsIds.has(administration.regionId))
      // alors l'administration n'est pas rattachée à l'étape
      if (!isAdministrationLocale) return titreEtapeAdministrations

      const titreEtapeAdministration = {
        titreEtapeId: titreEtape.id,
        administrationId: administration.id
      } as ITitreAdministrationLocale

      const associee = administration.titresTypes!.find(
        t => t.id === titreTypeId && t.associee
      )
      titreEtapeAdministration.associee = associee ? true : null

      titreEtapeAdministrations.push(titreEtapeAdministration)

      return titreEtapeAdministrations
    },
    []
  )
}

const titresEtapesAdministrationsLocalesBuild = (
  titres: ITitre[],
  administrations: IAdministration[]
) =>
  titres.reduce(
    (
      titresEtapesAdministrationsLocales: ITitreEtapeAdministrationLocale[],
      titre
    ) =>
      titre.demarches!.reduce(
        (titresEtapesAdministrationsLocales, titreDemarche) =>
          titreDemarche.etapes!.reduce(
            (titresEtapesAdministrationsLocales, titreEtape) => {
              const titreEtapeAdministrationsLocales = titreEtapeAdministrationsLocalesBuild(
                titre.typeId,
                titreEtape,
                administrations
              ) as ITitreAdministrationLocale[]

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
  titres: ITitre[],
  administrations: IAdministration[]
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

  let titresEtapesAdministrationsLocalesCreated = [] as ITitreAdministrationLocale[]
  const titresEtapesAdministrationsLocalesDeleted = [] as string[]

  if (titresEtapesAdministrationsLocalesToDelete.length) {
    const queue = new PQueue({ concurrency: 100 })

    titresEtapesAdministrationsLocalesToDelete.reduce(
      (
        titresEtapesAdministrationsLocalesDeleted,
        { titreEtapeId, administrationId }
      ) => {
        queue.add(async () => {
          await titreEtapeAdministrationDelete(titreEtapeId, administrationId)

          console.info(
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

  if (titresEtapesAdministrationsLocalesToCreate.length) {
    titresEtapesAdministrationsLocalesCreated = await titresEtapesAdministrationsCreate(
      titresEtapesAdministrationsLocalesToCreate
    )

    console.info(
      `mise à jour: étape administrations ${titresEtapesAdministrationsLocalesCreated
        .map(tea => JSON.stringify(tea))
        .join(', ')}`
    )
  }

  return [
    titresEtapesAdministrationsLocalesCreated,
    titresEtapesAdministrationsLocalesDeleted
  ]
}

export default titresEtapesAdministrationsLocalesUpdate
