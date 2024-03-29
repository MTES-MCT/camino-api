import PQueue from 'p-queue'

import {
  ITitre,
  IAdministration,
  ITitreAdministrationLocale,
  ITitreEtape,
  ICommune
} from '../../types'

import {
  titresEtapesAdministrationsCreate,
  titreEtapeAdministrationDelete
} from '../../database/queries/titres-etapes'
import { titresGet } from '../../database/queries/titres'
import { administrationsGet } from '../../database/queries/administrations'
import { userSuper } from '../../database/user-super'

const titreEtapeAdministrationsLocalesCreatedBuild = (
  titreEtapeAdministrationsLocalesOld: IAdministration[] | null | undefined,
  titreEtapeAdministrationsLocales: ITitreAdministrationLocale[]
) =>
  titreEtapeAdministrationsLocales.reduce(
    (queries: ITitreAdministrationLocale[], titreEtapeAdministrationLocale) => {
      if (
        !titreEtapeAdministrationsLocalesOld ||
        !titreEtapeAdministrationsLocalesOld.find(
          ({ id: idOld, associee }) =>
            idOld === titreEtapeAdministrationLocale.administrationId &&
            associee === titreEtapeAdministrationLocale.associee
        )
      ) {
        queries.push(titreEtapeAdministrationLocale)
      }

      return queries
    },
    []
  )

const titreEtapeAdministrationsLocalesToDeleteBuild = (
  titreEtapeAdministrationsLocalesOld: IAdministration[],
  titreEtapeAdministrationsLocales: ITitreAdministrationLocale[],
  titreEtapeId: string
) =>
  titreEtapeAdministrationsLocalesOld.reduce(
    (
      queries: ITitreAdministrationLocale[],
      { id: idOld, associee: associeeOld }
    ) => {
      if (
        !titreEtapeAdministrationsLocales.find(
          ({ administrationId: idNew, associee: associeeNew }) =>
            idNew === idOld && associeeOld === associeeNew
        )
      ) {
        queries.push({ titreEtapeId, administrationId: idOld })
      }

      return queries
    },
    []
  )

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
        titresEtapesAdministrationsLocalesToDelete: ITitreAdministrationLocale[]
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

      if (titreEtapeAdministrationsLocalesOld) {
        titresEtapesAdministrationsLocalesToDelete.push(
          ...titreEtapeAdministrationsLocalesToDeleteBuild(
            titreEtapeAdministrationsLocalesOld,
            titreEtapeAdministrationsLocales,
            titreEtapeId
          )
        )
      }

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
  communes: ICommune[] | undefined | null
) =>
  communes
    ? communes.reduce(
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
    : { titreRegionsIds: new Set(), titreDepartementsIds: new Set() }

const titreEtapeAdministrationsLocalesBuild = (
  titreTypeId: string,
  titreAdministrationIds: string[] | null | undefined,
  titreEtape: ITitreEtape,
  administrations: IAdministration[]
) => {
  const { titreDepartementsIds, titreRegionsIds } =
    titreEtapeAdministrationsRegionsAndDepartementsBuild(titreEtape.communes)

  // calcule toutes les administrations qui couvrent ces départements et régions
  return administrations.reduce(
    (
      titreEtapeAdministrations: ITitreAdministrationLocale[],
      administration: IAdministration
    ) => {
      // c’est une administration locale si le département ou la région de l'administration sont ceux de l’étape
      // ou si c’est une administration rattachée directement sur le titre
      const isAdministrationLocale =
        (administration.departementId &&
          titreDepartementsIds.has(administration.departementId)) ||
        (administration.regionId &&
          titreRegionsIds.has(administration.regionId)) ||
        titreAdministrationIds?.includes(administration.id)
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
              const titreEtapeAdministrationsLocales =
                titreEtapeAdministrationsLocalesBuild(
                  titre.typeId,
                  titre.titresAdministrations?.map(({ id }) => id),
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
  titresIds?: string[]
) => {
  console.info()
  console.info('administrations locales associées aux étapes…')

  const titres = await titresGet(
    { ids: titresIds },
    {
      fields: {
        titresAdministrations: { id: {} },
        demarches: {
          etapes: {
            administrations: { titresTypes: { id: {} } },
            communes: { departement: { id: {} } }
          }
        }
      }
    },
    userSuper
  )

  const administrations = await administrationsGet({}, {}, userSuper)

  // parcourt les étapes à partir des titres
  // car on a besoin de titre.domaineId
  const titresEtapesAdministrationsLocales =
    titresEtapesAdministrationsLocalesBuild(titres, administrations)

  const {
    titresEtapesAdministrationsLocalesToCreate,
    titresEtapesAdministrationsLocalesToDelete
  } = titresEtapesAdministrationsLocalesToCreateAndDeleteBuild(
    titresEtapesAdministrationsLocales
  )

  let titresEtapesAdministrationsLocalesCreated =
    [] as ITitreAdministrationLocale[]
  const titresEtapesAdministrationsLocalesDeleted =
    [] as ITitreAdministrationLocale[]

  if (titresEtapesAdministrationsLocalesToDelete.length) {
    const queue = new PQueue({ concurrency: 100 })

    titresEtapesAdministrationsLocalesToDelete.forEach(
      ({ titreEtapeId, administrationId }) => {
        queue.add(async () => {
          await titreEtapeAdministrationDelete(titreEtapeId, administrationId)

          const log = {
            type: 'titre / démarche / étape : administration locale (suppression) ->',
            value: `${titreEtapeId}: ${administrationId}`
          }

          console.info(log.type, log.value)

          titresEtapesAdministrationsLocalesDeleted.push({
            titreEtapeId,
            administrationId
          })
        })
      }
    )

    await queue.onIdle()
  }

  if (titresEtapesAdministrationsLocalesToCreate.length) {
    titresEtapesAdministrationsLocalesCreated =
      await titresEtapesAdministrationsCreate(
        titresEtapesAdministrationsLocalesToCreate
      )

    const log = {
      type: 'titres / démarches / étapes : administrations locales (création) ->',
      value: titresEtapesAdministrationsLocalesCreated
        .map(tea => JSON.stringify(tea))
        .join(', ')
    }

    console.info(log.type, log.value)
  }

  return {
    titresEtapesAdministrationsLocalesCreated,
    titresEtapesAdministrationsLocalesDeleted
  }
}

export { titresEtapesAdministrationsLocalesUpdate }
