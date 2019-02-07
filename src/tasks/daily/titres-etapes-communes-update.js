import { communesInsert } from '../communes'
import {
  titreEtapeCommunesInsert,
  titreEtapeCommunesDelete
} from '../titre-etapes'
import { geojsonFeatureMultiPolygon } from '../../tools/geojson'
import communesGeojsonGet from '../../tools/api-communes'

const titresEtapesCommunesUpdate = async (titresEtapes, communes) => {
  const titresEtapesCommunes = await titresEtapesCommunesGet(titresEtapes)

  const communesInsertQueries = communesInsertQueriesBuild(
    titresEtapesCommunes,
    communes
  )

  await Promise.all(communesInsertQueries)

  const {
    titresEtapesCommunesInsertQueries,
    titresEtapesCommunesDeleteQueries
  } = titresEtapesCommunesQueriesBuild(titresEtapes, titresEtapesCommunes)

  await Promise.all([
    titresEtapesCommunesInsertQueries,
    titresEtapesCommunesDeleteQueries
  ])

  return `Mise à jour: ${
    communesInsertQueries.length
  } communes dans des étapes.`
}

const communesInsertQueriesBuild = (titresEtapesCommunes, communes) =>
  Object.keys(titresEtapesCommunes).reduce(
    (communesInsertQueries, titreEtapeId) => {
      const communesInsertQueriesNew = communesInsert(
        titresEtapesCommunes[titreEtapeId],
        communes
      )

      return [...communesInsertQueries, ...communesInsertQueriesNew]
    },
    []
  )

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

    if (!communesGeojson.length) continue

    titresEtapesCommunes[titreEtape.id] = communesGeojson.map(geojson => ({
      id: geojson.properties.code,
      nom: geojson.properties.nom,
      departementId: geojson.properties.departement
    }))
  }

  return titresEtapesCommunes
}

export default titresEtapesCommunesUpdate
