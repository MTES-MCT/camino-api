import { communesInsert } from '../communes'
import {
  titreEtapeCommunesInsert,
  titreEtapeCommunesDelete
} from '../titre-etapes'
import { geojsonFeatureMultiPolygon } from '../../tools/geojson'
import communesGeojsonGet from '../../tools/api-communes'

const titresEtapesCommunesUpdate = async (titresEtapes, communes) => {
  const titresEtapesCommunes = await titresEtapesCommunesGet(titresEtapes)

  const communesNew = Object.keys(titresEtapesCommunes).reduce(
    (res, titreEtapeId) => [
      ...res,
      ...titresEtapesCommunes[titreEtapeId].reduce(
        (r, commune) =>
          res.find(c => c.id === commune.id) ? r : [...r, commune],
        []
      )
    ],
    []
  )

  const communesInsertQueries = communesInsert(communesNew, communes)

  await Promise.all(communesInsertQueries)

  const {
    titresEtapesCommunesInsertQueries,
    titresEtapesCommunesDeleteQueries
  } = titresEtapesCommunesQueriesBuild(titresEtapes, titresEtapesCommunes)

  await Promise.all([
    titresEtapesCommunesInsertQueries,
    titresEtapesCommunesDeleteQueries
  ])

  return [
    `Mise à jour: ${communesInsertQueries.length} communes.`,
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
    geojson.properties = { id: titreEtape.id }

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
