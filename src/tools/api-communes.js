import * as fetch from 'node-fetch'
import errorLog from './error-log'

const communesGeojsonGet = async geojson => {
  try {
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
    errorLog(`communesGeojsonGet ${JSON.stringify(geojson.properties)}`, error)
  }
}

export default communesGeojsonGet
