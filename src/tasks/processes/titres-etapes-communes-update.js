import { communesInsert } from '../queries/communes'
import {
  titreEtapeCommunesInsert,
  titreEtapeCommunesDelete
} from '../queries/titre-etapes'
import { geojsonFeatureMultiPolygon } from '../../tools/geojson'
import communesGeojsonGet from '../../tools/api-communes'

const titresEtapesCommunesUpdate = async (titresEtapes, communes) => {
  // teste l'API geo-communes-api
  const geoCommunesApiTest = await communesGeojsonTest()
  // si la connexion à l'API échoue, retourne
  if (!geoCommunesApiTest) {
    return [
      "Erreur: impossible de se connecter à l'API Géo communes",
      'Mise à jour: 0 communes dans la base.',
      'Mise à jour: 0 communes dans des étapes.'
    ]
  }

  const titresEtapesCommunes = await titresEtapesCommunesGet(titresEtapes)

  const communesNew = Object.keys(titresEtapesCommunes).reduce(
    (acc, titreEtapeId) =>
      titresEtapesCommunes[titreEtapeId].reduce(
        (acc, commune) =>
          // Ajoute la commune si elle n'est pas déjà présente dans l'accumulateur
          acc.find(c => c.id === commune.id) ? acc : [...acc, commune],
        acc
      ),
    []
  )

  const communesInsertQueries = communesInsert(communesNew, communes).map(q =>
    q.then(log => console.log(log))
  )

  await Promise.all(communesInsertQueries)

  const {
    titresEtapesCommunesInsertQueries,
    titresEtapesCommunesDeleteQueries
  } = titresEtapesCommunesQueriesBuild(titresEtapes, titresEtapesCommunes)

  const titreEtapesCommunesQueries = [
    ...titresEtapesCommunesInsertQueries,
    ...titresEtapesCommunesDeleteQueries
  ].map(q => q.then(log => console.log(log)))

  await Promise.all(titreEtapesCommunesQueries)

  return [
    `Mise à jour: ${communesInsertQueries.length} communes dans la base.`,
    `Mise à jour: ${titresEtapesCommunesInsertQueries.length +
      titresEtapesCommunesDeleteQueries.length} communes dans des étapes.`
  ]
}

const titresEtapesCommunesQueriesBuild = (titresEtapes, titresEtapesCommunes) =>
  Object.keys(titresEtapesCommunes).reduce(
    (
      { titresEtapesCommunesInsertQueries, titresEtapesCommunesDeleteQueries },
      titreEtapeId
    ) => {
      const titreEtape = titresEtapes.find(te => te.id === titreEtapeId)
      const communesIds = titresEtapesCommunes[titreEtapeId].map(
        commune => commune.id
      )

      const titreEtapeCommunesInsertQueriesNew = titreEtapeCommunesInsert(
        titreEtape,
        communesIds
      )

      const titreEtapeCommunesDeleteQueriesNew = titreEtapeCommunesDelete(
        titreEtape,
        communesIds
      )

      return {
        titresEtapesCommunesInsertQueries: [
          ...titresEtapesCommunesInsertQueries,
          ...titreEtapeCommunesInsertQueriesNew
        ],
        titresEtapesCommunesDeleteQueries: [
          ...titresEtapesCommunesDeleteQueries,
          ...titreEtapeCommunesDeleteQueriesNew
        ]
      }
    },
    {
      titresEtapesCommunesInsertQueries: [],
      titresEtapesCommunesDeleteQueries: []
    }
  )

const titresEtapesCommunesGet = async titresEtapes => {
  const titresEtapesCommunes = {}
  for (const titreEtape of titresEtapes) {
    if (!titreEtape.points.length) continue

    const geojson = geojsonFeatureMultiPolygon(titreEtape.points)

    const communesGeojson = await communesGeojsonGet(geojson)

    if (!communesGeojson || !communesGeojson.length) continue

    titresEtapesCommunes[titreEtape.id] = communesGeojson.map(geojson => ({
      id: geojson.properties.code,
      nom: geojson.properties.nom,
      departementId: geojson.properties.departement
    }))
  }

  return titresEtapesCommunes
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
