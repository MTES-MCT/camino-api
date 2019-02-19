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

  const geojsonCommunes = await geojsonCommunesGet(geojson)

  if (!geojsonCommunes || !geojsonCommunes.length) {
    return []
  }

  const communesIds = geojsonCommunes.map(
    geojson => `${geojson.properties.code}`
  )

  const titreEtapeCommunes = geojsonCommunes.map(geojson => ({
    id: `${geojson.properties.code}`,
    nom: geojson.properties.nom,
    departementId: `${geojson.properties.departement}`
  }))

  const communesInsertQueries = communesInsert(titreEtapeCommunes, communes)

  await Promise.all(communesInsertQueries)

  const titreEtapeCommunesInsertQueries = titreEtapeCommunesInsert(
    titreEtape,
    communesIds
  )

  const titreEtapeCommunesDeleteQueries = titreEtapeCommunesDelete(
    titreEtape,
    communesIds
  )

  await Promise.all(titreEtapeCommunesInsertQueries)
  await Promise.all(titreEtapeCommunesDeleteQueries)

  return [
    `Mise à jour: ${titreEtapeCommunes.length} communes dans la base.`,
    `Mise à jour: ${
      titreEtapeCommunesInsertQueries.length
    } communes dans des étapes.`
  ]
}

export default titreEtapeCommunesUpdate
