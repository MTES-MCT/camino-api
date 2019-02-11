import * as fetch from 'node-fetch'

const communesGeojsonGet = geojson =>
  fetch(process.env.GEO_API_URL, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(geojson)
  }).then(
    response => response.json(),
    err => {
      console.log('communesGeojsonGet error: ', err)
      return []
    }
  )

export default communesGeojsonGet
