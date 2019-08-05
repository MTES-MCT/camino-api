import * as fetch from 'node-fetch'
import * as geojsonhint from '@mapbox/geojsonhint'
import errorLog from '../error-log'

const communesGeojsonFetch = async (path, geojson) => {
  const properties = JSON.stringify(geojson.properties)

  try {
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

    const result = await response.json()

    if (response.status >= 400) {
      throw result
    }

    return result
  } catch (e) {
    errorLog(`communesGeojsonGet ${properties}`, e.error || e.message || e)
  }
}

const communeFormat = geojson => ({
  id: geojson.properties.code,
  nom: geojson.properties.nom,
  departementId: geojson.properties.departement
})

const departementFormat = geojson => ({
  id: geojson.properties.code,
  nom: geojson.properties.nom,
  regionId: geojson.properties.region
})

const communesGeojsonGet = async geojson => {
  const communesGeojson = await communesGeojsonFetch('/', geojson)
  if (!communesGeojson || !Array.isArray(communesGeojson)) return null

  return communesGeojson.map(communeFormat)
}

const departementChefGeojsonGet = async geojson => {
  const chef = await communesGeojsonFetch('/departement-chef', geojson)

  return departementFormat(chef)
}

export default communesGeojsonGet
export { departementChefGeojsonGet }
