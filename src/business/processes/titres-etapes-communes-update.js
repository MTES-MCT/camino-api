import PQueue from 'p-queue'
import { communesUpsert } from '../../database/queries/territoires'
import {
  titresEtapesCommunesCreate,
  titreEtapeCommuneDelete
} from '../../database/queries/titres-etapes'
import { geojsonFeatureMultiPolygon } from '../../tools/geojson'
import communesGeojsonGet from '../../tools/api-communes/index'

const titreEtapesCommunesCreateBuild = (titreEtape, communesEtape) =>
  communesEtape.reduce(
    (queries, { id: communeId }) =>
      !titreEtape.communes ||
      !titreEtape.communes.find(communeOld => communeOld.id === communeId)
        ? [
            ...queries,
            {
              titreEtapeId: titreEtape.id,
              communeId
            }
          ]
        : queries,
    []
  )

const titreEtapesCommunesDeleteBuild = (titreEtape, communesEtape) =>
  titreEtape.communes
    ? titreEtape.communes.reduce(
        (queries, communeOld) =>
          !communesEtape.find(communeEtape => communeEtape.id === communeOld.id)
            ? [
                ...queries,
                {
                  titreEtapeId: titreEtape.id,
                  communeId: communeOld.id
                }
              ]
            : queries,
        []
      )
    : []

const titresEtapesCommunesCreatedDeletedBuild = (
  titresEtapes,
  titresEtapesCommunes
) =>
  Object.keys(titresEtapesCommunes).reduce(
    (
      { titresEtapesCommunesCreated, titresEtapesCommunesDeleted },
      titreEtapeId
    ) => {
      const titreEtape = titresEtapes.find(te => te.id === titreEtapeId)
      const communesEtape = titresEtapesCommunes[titreEtapeId]

      const titreEtapesCommunesCreated = titreEtapesCommunesCreateBuild(
        titreEtape,
        communesEtape
      )

      const titreEtapeCommunesDeleted = titreEtapesCommunesDeleteBuild(
        titreEtape,
        communesEtape
      )

      return {
        titresEtapesCommunesCreated: [
          ...titresEtapesCommunesCreated,
          ...titreEtapesCommunesCreated
        ],
        titresEtapesCommunesDeleted: [
          ...titresEtapesCommunesDeleted,
          ...titreEtapeCommunesDeleted
        ]
      }
    },
    {
      titresEtapesCommunesCreated: [],
      titresEtapesCommunesDeleted: []
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
        ({ communesIndex, communesNew }, commune) =>
          // Ajoute la commune
          // - si elle n'est pas déjà présente dans l'accumulateur
          // - si elle n'est pas présente dans communesOld
          !communesIndex[commune.id] && !communesOldIndex[commune.id]
            ? {
                communesIndex: { ...communesIndex, [commune.id]: true },
                communesNew: [...communesNew, commune]
              }
            : { communesIndex, communesNew },
        acc
      ),
    { communesIndex: {}, communesNew: [] }
  )

  return communesNew
}

const titresEtapesCommunesGet = async titresEtapes => {
  const communesGeojsonGetRequests = titresEtapes.map(
    titreEtape => async () => {
      let communesGeojson

      if (titreEtape.points.length) {
        const geojson = geojsonFeatureMultiPolygon(titreEtape.points)

        communesGeojson = await communesGeojsonGet(geojson)
      }

      return {
        titreEtapeId: titreEtape.id,
        communesGeojson: communesGeojson || []
      }
    }
  )

  // exécute les requêtes en série
  // avec PQueue plutôt que Promise.all
  // pour ne pas surcharger l'API geocommunes
  const queue = new PQueue({ concurrency: 100 })
  const communesGeojsons = await queue.addAll(communesGeojsonGetRequests)

  return communesGeojsons.reduce(
    (titresEtapesCommunes, { titreEtapeId, communesGeojson }) => ({
      ...titresEtapesCommunes,
      [titreEtapeId]: communesGeojson
    }),
    {}
  )
}

const communesGeojsonTest = () => {
  const geojson = {
    type: 'Feature',
    properties: { id: 'api-test' },
    geometry: {
      type: 'Polygon',
      coordinates: [[[2, 48], [3, 48], [3, 49], [2, 49], [2, 48]]]
    }
  }

  return communesGeojsonGet(geojson)
}

const titresEtapesCommunesUpdate = async (titresEtapes, communesOld) => {
  // teste l'API geo-communes-api
  const geoCommunesApiTest = await communesGeojsonTest()
  // si la connexion à l'API échoue, retourne
  if (!geoCommunesApiTest) {
    return [
      "erreur: impossible de se connecter à l'API Géo communes",
      'mise à jour: 0 commune(s)',
      'mise à jour: 0 commune(s) ajoutée(s) dans des étapes',
      'mise à jour: 0 commune(s) supprimée(s) dans des étapes'
    ]
  }

  const titresEtapesCommunes = await titresEtapesCommunesGet(titresEtapes)

  const communesUpdated = communesBuild(communesOld, titresEtapesCommunes)

  if (communesUpdated.length) {
    await communesUpsert(communesUpdated)
    console.log(
      `mise à jour: communes, ${communesUpdated
        .map(commune => commune.id)
        .join(', ')}`
    )
  }

  const {
    titresEtapesCommunesCreated,
    titresEtapesCommunesDeleted
  } = titresEtapesCommunesCreatedDeletedBuild(
    titresEtapes,
    titresEtapesCommunes
  )

  if (titresEtapesCommunesCreated.length) {
    await titresEtapesCommunesCreate(titresEtapesCommunesCreated)
    console.log(
      `mise à jour: étape communes ${titresEtapesCommunesCreated
        .map(tec => JSON.stringify(tec))
        .join(', ')}`
    )
  }

  if (titresEtapesCommunesDeleted.length) {
    const titresEtapesCommunesDeleteQueries = titresEtapesCommunesDeleted.map(
      ({ titreEtapeId, communeId }) => async () => {
        await titreEtapeCommuneDelete(titreEtapeId, communeId)
        console.log(`suppression: étape ${titreEtapeId}, commune ${communeId}`)
      }
    )

    const queue = new PQueue({ concurrency: 100 })
    await queue.addAll(titresEtapesCommunesDeleteQueries)
  }

  return [
    `mise à jour: ${communesUpdated.length} commune(s)`,
    `mise à jour: ${titresEtapesCommunesCreated.length} commune(s) ajoutée(s) dans des étapes`,
    `mise à jour: ${titresEtapesCommunesDeleted.length} commune(s) supprimée(s) dans des étapes`
  ]
}

export default titresEtapesCommunesUpdate
export { communesGeojsonTest }
