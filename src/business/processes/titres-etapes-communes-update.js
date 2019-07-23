import { communesUpsert } from '../queries/communes'
import {
  titreEtapesCommunesCreate,
  titreEtapeCommuneDelete
} from '../queries/titre-etapes'
import { geojsonFeatureMultiPolygon } from '../../tools/geojson'
import communesGeojsonGet from '../../tools/api-communes'
import PQueue from 'p-queue'

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

const communesBuild = (communesOld, titresEtapesCommunes) => {
  const communesOldIndex = communesOld.reduce(
    (communesOldIndex, communeOld) => ({
      ...communesOldIndex,
      [communeOld.id]: communeOld
    }),
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
            ? { communesIndex, communesNew: [...communesNew, commune] }
            : { communesIndex, communesNew },
        acc
      ),
    { communesIndex: {}, communesNew: [] }
  )

  return communesNew
}

const titresEtapesCommunesUpdate = async (titresEtapes, communesOld) => {
  // teste l'API geo-communes-api
  const geoCommunesApiTest = await communesGeojsonTest()
  // si la connexion à l'API échoue, retourne
  if (!geoCommunesApiTest) {
    return [
      "Erreur: impossible de se connecter à l'API Géo communes",
      'Mise à jour: 0 commune(s).',
      'Mise à jour: 0 commune(s) ajoutée(s) dans des étapes.',
      'Mise à jour: 0 commune(s) supprimée(s) dans des étapes.'
    ]
  }

  const titresEtapesCommunes = await titresEtapesCommunesGet(titresEtapes)

  const communesUpdated = communesBuild(communesOld, titresEtapesCommunes)

  if (communesUpdated.length) {
    await communesUpsert(communesUpdated).then(console.log)
  }

  const {
    titresEtapesCommunesCreated,
    titresEtapesCommunesDeleted
  } = titresEtapesCommunesQueriesBuild(titresEtapes, titresEtapesCommunes)

  if (titresEtapesCommunesCreated.length) {
    await titreEtapesCommunesCreate(titresEtapesCommunes).then(console.log)
  }

  if (titresEtapesCommunesDeleted.length) {
    const titresEtapesCommunesDeleteQueries = titresEtapesCommunesDeleted.map(
      ({ titreEtapeId, communeId }) => () =>
        titreEtapeCommuneDelete(titreEtapeId, communeId).then(console.log)
    )

    const queue = new PQueue({ concurrency: 100 })
    await queue.addAll(titresEtapesCommunesDeleteQueries)
  }

  return [
    `Mise à jour: ${communesUpdated.length} commune(s).`,
    `Mise à jour: ${titresEtapesCommunesCreated.length} commune(s) ajoutée(s) dans des étapes.`,
    `Mise à jour: ${titresEtapesCommunesDeleted.length} commune(s) supprimée(s) dans des étapes.`
  ]
}

const titresEtapesCommunesQueriesBuild = (titresEtapes, titresEtapesCommunes) =>
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

const titresEtapesCommunesGet = async titresEtapes => {
  const communesGeojsonGetRequests = titresEtapes.map(
    titreEtape => async () => {
      let communesGeojson = []

      if (titreEtape.points.length) {
        const geojson = geojsonFeatureMultiPolygon(titreEtape.points)

        communesGeojson = await communesGeojsonGet(geojson)
      }

      return {
        titreEtapeId: titreEtape.id,
        communesGeojson
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

export default titresEtapesCommunesUpdate
export { communesGeojsonTest }
