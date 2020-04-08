import { ITitreEtape, ITitreCommune, ICommune } from '../../types'

import PQueue from 'p-queue'

import { communesUpsert } from '../../database/queries/territoires'
import {
  titresEtapesCommunesUpdate as titresEtapesCommunesUpdateQuery,
  titreEtapeCommuneDelete
} from '../../database/queries/titres-etapes'
import { geojsonFeatureMultiPolygon } from '../../tools/geojson'
import communesGeojsonGet from '../../tools/api-communes/index'

interface ITitreEtapesCommunesIndex {
  [id: string]: {
    titreEtape: ITitreEtape
    titreEtapeCommunes: ICommune[]
  }
}
interface ICommunesIndex {
  [id: string]: boolean
}

const titreEtapesCommunesUpdateBuild = (
  titreEtape: ITitreEtape,
  communesEtape: ICommune[]
) =>
  communesEtape.reduce(
    (titreEtapesCommunes: ITitreCommune[], commune: ICommune) => {
      const titreEtapeCommune =
        titreEtape.communes &&
        titreEtape.communes.find(communeOld => communeOld.id === commune.id)

      if (
        (!titreEtapeCommune || titreEtapeCommune.surface !== commune.surface) &&
        !titreEtapesCommunes.find(tec => tec.communeId === commune.id)
      ) {
        titreEtapesCommunes.push({
          titreEtapeId: titreEtape.id,
          communeId: commune.id,
          surface: commune.surface
        })
      }

      return titreEtapesCommunes
    },
    []
  )

const titreEtapesCommunesDeleteBuild = (
  titreEtape: ITitreEtape,
  communesEtape: ICommune[]
) =>
  titreEtape.communes
    ? titreEtape.communes.reduce(
        (titreEtapesCommunes: ITitreCommune[], communeOld) => {
          if (
            !communesEtape.find(
              communeEtape => communeEtape.id === communeOld.id
            )
          ) {
            titreEtapesCommunes.push({
              titreEtapeId: titreEtape.id,
              communeId: communeOld.id
            })
          }

          return titreEtapesCommunes
        },
        []
      )
    : []

const titresEtapesCommunesToUpdateAndDeleteBuild = (
  titresEtapesCommunesIndex: ITitreEtapesCommunesIndex
) =>
  Object.keys(titresEtapesCommunesIndex).reduce(
    (
      {
        titresEtapesCommunesToUpdate,
        titresEtapesCommunesToDelete
      }: {
        titresEtapesCommunesToUpdate: ITitreCommune[]
        titresEtapesCommunesToDelete: ITitreCommune[]
      },
      titreEtapeId
    ) => {
      const { titreEtape, titreEtapeCommunes } = titresEtapesCommunesIndex[
        titreEtapeId
      ]

      titresEtapesCommunesToUpdate.push(
        ...titreEtapesCommunesUpdateBuild(titreEtape, titreEtapeCommunes)
      )

      titresEtapesCommunesToDelete.push(
        ...titreEtapesCommunesDeleteBuild(titreEtape, titreEtapeCommunes)
      )

      return {
        titresEtapesCommunesToUpdate,
        titresEtapesCommunesToDelete
      }
    },
    {
      titresEtapesCommunesToUpdate: [],
      titresEtapesCommunesToDelete: []
    }
  )

const communesBuild = (
  communesOld: ICommune[],
  titresEtapesCommunesIndex: ITitreEtapesCommunesIndex
) => {
  const communesOldIndex = communesOld.reduce(
    (communesOldIndex: ICommunesIndex, communeOld) => {
      communesOldIndex[communeOld.id] = true

      return communesOldIndex
    },
    {}
  )

  const { communesNew } = Object.keys(titresEtapesCommunesIndex).reduce(
    (
      acc: { communesIndex: ICommunesIndex; communesNew: ICommune[] },
      titreEtapeId
    ) =>
      titresEtapesCommunesIndex[titreEtapeId].titreEtapeCommunes.reduce(
        ({ communesIndex, communesNew }, { id, nom, departementId }) => {
          // Ajoute la commune
          // - si elle n'est pas déjà présente dans l'accumulateur
          // - si elle n'est pas présente dans communesOld
          if (!communesIndex[id] && !communesOldIndex[id]) {
            communesNew.push({ id, nom, departementId })
            communesIndex[id] = true
          }

          return { communesIndex, communesNew }
        },
        acc
      ),
    { communesIndex: {}, communesNew: [] }
  )

  return communesNew
}

const titresEtapesCommunesGet = async (titresEtapes: ITitreEtape[]) => {
  // exécute les requêtes en série
  // avec PQueue plutôt que Promise.all
  // pour ne pas surcharger l'API geocommunes
  const queue = new PQueue({
    concurrency: 10
    //    interval: 1000,
    //    intervalCap: 10
  })

  const titresEtapesCommunesIndex = titresEtapes.reduce(
    (
      titresEtapesCommunesIndex: ITitreEtapesCommunesIndex,
      titreEtape: ITitreEtape
    ) => {
      queue.add(async () => {
        let titreEtapeCommunes

        if (titreEtape.points?.length) {
          const geojson = geojsonFeatureMultiPolygon(titreEtape.points)

          titreEtapeCommunes = await communesGeojsonGet(geojson)
        }

        titresEtapesCommunesIndex[titreEtape.id] = {
          titreEtape,
          titreEtapeCommunes: titreEtapeCommunes || []
        }
      })

      return titresEtapesCommunesIndex
    },
    {}
  )

  await queue.onIdle()

  return titresEtapesCommunesIndex
}

const communesGeojsonTest = () => {
  const geojson = {
    type: 'Feature',
    properties: { id: 'api-test' },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [2, 48],
          [3, 48],
          [3, 49],
          [2, 49],
          [2, 48]
        ]
      ]
    }
  }

  return communesGeojsonGet(geojson)
}

const titresEtapesCommunesUpdate = async (
  titresEtapes: ITitreEtape[],
  communesOld: ICommune[]
) => {
  // teste l'API geo-communes-api
  const geoCommunesApiTest = await communesGeojsonTest()
  // si la connexion à l'API échoue, retourne
  if (!geoCommunesApiTest) {
    return [[], [], []]
  }

  const titresEtapesCommunes = await titresEtapesCommunesGet(titresEtapes)

  const communesToUpdate = communesBuild(communesOld, titresEtapesCommunes)

  let communesUpdated = [] as ICommune[]

  if (communesToUpdate.length) {
    communesUpdated = await communesUpsert(communesToUpdate)

    console.info(
      `mise à jour: communes, ${communesToUpdate
        .map(commune => commune.id)
        .join(', ')}`
    )
  }

  const {
    titresEtapesCommunesToUpdate,
    titresEtapesCommunesToDelete
  } = titresEtapesCommunesToUpdateAndDeleteBuild(titresEtapesCommunes)

  const titresEtapesCommunesUpdated = [] as string[]
  const titresEtapesCommunesDeleted = [] as string[]

  if (titresEtapesCommunesToUpdate.length) {
    const queue = new PQueue({ concurrency: 100 })

    titresEtapesCommunesToUpdate.reduce(
      (titresEtapesCommunesUpdated: string[], titreEtapeCommune) => {
        queue.add(async () => {
          await titresEtapesCommunesUpdateQuery(titreEtapeCommune)

          console.info(
            `mise à jour: étape commune ${JSON.stringify(titreEtapeCommune)}`
          )

          titresEtapesCommunesUpdated.push(titreEtapeCommune.titreEtapeId)
        })

        return titresEtapesCommunesUpdated
      },
      titresEtapesCommunesUpdated
    )

    await queue.onIdle()
  }

  if (titresEtapesCommunesToDelete.length) {
    const queue = new PQueue({ concurrency: 100 })

    titresEtapesCommunesToDelete.reduce(
      (titresEtapesCommunesDeleted, { titreEtapeId, communeId }) => {
        queue.add(async () => {
          await titreEtapeCommuneDelete(titreEtapeId, communeId)

          console.info(
            `suppression: étape ${titreEtapeId}, commune ${communeId}`
          )

          titresEtapesCommunesDeleted.push(titreEtapeId)
        })

        return titresEtapesCommunesDeleted
      },
      titresEtapesCommunesDeleted
    )

    await queue.onIdle()
  }

  return [
    communesUpdated,
    titresEtapesCommunesUpdated,
    titresEtapesCommunesDeleted
  ]
}

export default titresEtapesCommunesUpdate
export { communesGeojsonTest }
