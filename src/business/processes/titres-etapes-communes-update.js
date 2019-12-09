import PQueue from 'p-queue'

import { communesUpsert } from '../../database/queries/territoires'
import {
  titresEtapesCommunesUpdate as titresEtapesCommunesUpdateQuery,
  titreEtapeCommuneDelete
} from '../../database/queries/titres-etapes'
import { geojsonFeatureMultiPolygon } from '../../tools/geojson'
import communesGeojsonGet from '../../tools/api-communes/index'

const titreEtapesCommunesUpdateBuild = (titreEtape, communesEtape) =>
  communesEtape.reduce((queries, { id: communeId, surface }) => {
    const titreEtapeCommune =
      titreEtape.communes &&
      titreEtape.communes.find(communeOld => communeOld.id === communeId)

    if (!titreEtapeCommune || titreEtapeCommune.surface !== surface) {
      queries.push({
        titreEtapeId: titreEtape.id,
        communeId,
        surface
      })
    }

    return queries
  }, [])

const titreEtapesCommunesDeleteBuild = (titreEtape, communesEtape) =>
  titreEtape.communes
    ? titreEtape.communes.reduce((queries, communeOld) => {
        if (
          !communesEtape.find(communeEtape => communeEtape.id === communeOld.id)
        ) {
          queries.push({
            titreEtapeId: titreEtape.id,
            communeId: communeOld.id
          })
        }

        return queries
      }, [])
    : []

const titresEtapesCommunesToUpdateAndDeleteBuild = (
  titresEtapes,
  titresEtapesCommunes
) =>
  Object.keys(titresEtapesCommunes).reduce(
    (
      { titresEtapesCommunesToUpdate, titresEtapesCommunesToDelete },
      titreEtapeId
    ) => {
      const titreEtape = titresEtapes.find(te => te.id === titreEtapeId)
      const communesEtape = titresEtapesCommunes[titreEtapeId]

      titresEtapesCommunesToUpdate.push(
        ...titreEtapesCommunesUpdateBuild(titreEtape, communesEtape)
      )

      titresEtapesCommunesToDelete.push(
        ...titreEtapesCommunesDeleteBuild(titreEtape, communesEtape)
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

const communesBuild = (communesOld, titresEtapesCommunes) => {
  const communesOldIndex = communesOld.reduce(
    (communesOldIndex, communeOld) => {
      communesOldIndex[communeOld.id] = true

      return communesOldIndex
    },
    {}
  )

  const { communesNew } = Object.keys(titresEtapesCommunes).reduce(
    (acc, titreEtapeId) =>
      titresEtapesCommunes[titreEtapeId].reduce(
        ({ communesIndex, communesNew }, commune) => {
          // Ajoute la commune
          // - si elle n'est pas déjà présente dans l'accumulateur
          // - si elle n'est pas présente dans communesOld
          if (!communesIndex[commune.id] && !communesOldIndex[commune.id]) {
            communesNew.push(commune)
            communesIndex[commune.id] = true
          }

          return { communesIndex, communesNew }
        },
        acc
      ),
    { communesIndex: {}, communesNew: [] }
  )

  return communesNew
}

const titresEtapesCommunesGet = async titresEtapes => {
  // exécute les requêtes en série
  // avec PQueue plutôt que Promise.all
  // pour ne pas surcharger l'API geocommunes
  const queue = new PQueue({
    concurrency: 10
    //    interval: 1000,
    //    intervalCap: 10
  })

  const titresEtapesCommunes = titresEtapes.reduce(
    (titresEtapesCommunes, titreEtape) => {
      queue.add(async () => {
        let titreEtapeCommunes

        if (titreEtape.points.length) {
          const geojson = geojsonFeatureMultiPolygon(titreEtape.points)

          titreEtapeCommunes = await communesGeojsonGet(geojson)
        }

        titresEtapesCommunes[titreEtape.id] = titreEtapeCommunes || []
      })

      return titresEtapesCommunes
    },
    {}
  )

  await queue.onIdle()

  return titresEtapesCommunes
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

const titresEtapesCommunesUpdate = async (titresEtapes, communesOld) => {
  // teste l'API geo-communes-api
  const geoCommunesApiTest = await communesGeojsonTest()
  // si la connexion à l'API échoue, retourne
  if (!geoCommunesApiTest) {
    return [[], [], []]
  }

  const titresEtapesCommunes = await titresEtapesCommunesGet(titresEtapes)

  const communesToUpdate = communesBuild(communesOld, titresEtapesCommunes)

  let communesUpdated = []

  if (communesToUpdate.length) {
    communesUpdated = await communesUpsert(communesToUpdate)
    console.log(
      `mise à jour: communes, ${communesToUpdate
        .map(commune => commune.id)
        .join(', ')}`
    )
  }

  const {
    titresEtapesCommunesToUpdate,
    titresEtapesCommunesToDelete
  } = titresEtapesCommunesToUpdateAndDeleteBuild(
    titresEtapes,
    titresEtapesCommunes
  )

  const titresEtapesCommunesUpdated = []
  const titresEtapesCommunesDeleted = []

  if (titresEtapesCommunesToUpdate.length) {
    const queue = new PQueue({ concurrency: 100 })

    titresEtapesCommunesToUpdate.reduce(
      (titresEtapesCommunesUpdated, titreEtapeCommune) => {
        queue.add(async () => {
          await titresEtapesCommunesUpdateQuery(titreEtapeCommune)

          console.log(
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

          console.log(
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
