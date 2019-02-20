import { communesInsert } from '../communes'
import {
  titreEtapeCommunesInsert,
  titreEtapeCommunesDelete
} from '../titre-etapes'
import { geojsonFeatureMultiPolygon } from '../../tools/geojson'
import geojsonCommunesGet from '../../tools/api-communes'

const titreEtapeCommunesUpdate = async (titreEtape, communes) => {
  if (!titreEtape.points || !titreEtape.points.length) {
    return []
  }

  const geojson = geojsonFeatureMultiPolygon(titreEtape.points)
  geojson.properties = { id: titreEtape.id }

  const geojsonCommunes = await geojsonCommunesGet(geojson)

  if (!geojsonCommunes || !geojsonCommunes.length) {
    return []
  }

  const communesIds = geojsonCommunes.map(
    geojson => `${geojson.properties.code}`
  )

  const communesNew = geojsonCommunes.map(geojson => ({
    id: `${geojson.properties.code}`,
    nom: geojson.properties.nom,
    departementId: `${geojson.properties.departement}`
  }))

  const communesInsertQueries = communesInsert(communesNew, communes).map(q =>
    q.then(log => console.log(log))
  )

  await Promise.all(communesInsertQueries)

  const titreEtapeCommunesInsertQueries = titreEtapeCommunesInsert(
    titreEtape,
    communesIds
  )

  const titreEtapeCommunesDeleteQueries = titreEtapeCommunesDelete(
    titreEtape,
    communesIds
  )

  const titreEtapeCommunesQueries = [
    ...titreEtapeCommunesInsertQueries,
    ...titreEtapeCommunesDeleteQueries
  ].map(q => q.then(log => console.log(log)))

  await Promise.all(titreEtapeCommunesQueries)

  return [
    `Mise à jour: ${communesInsertQueries.length} communes dans la base.`,
    `Mise à jour: ${titreEtapeCommunesInsertQueries.length +
      titreEtapeCommunesDeleteQueries.length} communes dans des étapes.`
  ]
}

export default titreEtapeCommunesUpdate
