import * as fetch from 'node-fetch'
import * as geojsonhint from '@mapbox/geojsonhint'
import errorLog from './error-log'

const communesGeojsonFetch = async geojson => {
  const properties = JSON.stringify(geojson.properties)

  try {
    const geojsonErrors = geojsonhint.hint(geojson)
    if (geojsonErrors.length) {
      throw { error: geojsonErrors.map(e => e.message) }
    }

    const response = await fetch(process.env.GEO_API_URL, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(geojson)
    })

    const result = await response.json()

    if (response.status > 400) {
      throw result
    }

    return result
  } catch ({ error }) {
    errorLog(`communesGeojsonGet ${properties}`, error)
  }
}

const format = geojson => ({
  id: geojson.properties.code,
  nom: geojson.properties.nom,
  departementId: geojson.properties.departement
})

const communesGeojsonGet = async geojson => {
  const communesGeojson = await communesGeojsonFetch(geojson)
  if (!communesGeojson || !Array.isArray(communesGeojson)) return null

  return communesGeojson.map(format)
}

export default communesGeojsonGet
