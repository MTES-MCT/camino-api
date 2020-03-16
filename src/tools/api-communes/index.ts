import fetch from 'node-fetch'
import * as geojsonhint from '@mapbox/geojsonhint'
import errorLog from '../error-log'
import { IGeoJson, ICommune, IDepartement } from '../../types'

const communesGeojsonFetch = async (path: string, geojson: IGeoJson) => {
  const properties = JSON.stringify(geojson.properties)

  try {
    if (!process.env.GEO_API_URL) {
      throw new Error(
        "impossible de se connecter à l'API Géo Commune car la variable d'environnement est absente"
      )
    }

    const geojsonErrors = geojsonhint.hint(geojson)
    if (geojsonErrors.length) {
      throw new Error(geojsonErrors.map(e => e.message).join('\n'))
    }

    const response = await fetch(process.env.GEO_API_URL + path, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(geojson)
    })

    const result = (await response.json()) as IGeoJson

    if (response.status >= 400) {
      throw result
    }

    return result
  } catch (e) {
    errorLog(`communesGeojsonGet ${properties}`, e.error || e.message || e)

    return null
  }
}

const communeFormat = (geojson: IGeoJson) =>
  ({
    id: geojson.properties.code,
    nom: geojson.properties.nom,
    departementId: geojson.properties.departement,
    surface: geojson.properties.surface
  } as ICommune)

const departementFormat = (geojson: IGeoJson) =>
  ({
    id: geojson.properties.code,
    nom: geojson.properties.nom,
    regionId: geojson.properties.region
  } as IDepartement)

const communesGeojsonGet = async (geojson: IGeoJson) => {
  const communesGeojson = await communesGeojsonFetch('/', geojson)
  if (!communesGeojson || !Array.isArray(communesGeojson)) return null

  return communesGeojson.map(communeFormat)
}

const departementChefGeojsonGet = async (geojson: IGeoJson) => {
  const chef = await communesGeojsonFetch('/departement-chef', geojson)
  if (!chef) return null

  return departementFormat(chef)
}

export default communesGeojsonGet
export { departementChefGeojsonGet }
