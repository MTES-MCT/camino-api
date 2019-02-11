import * as fetch from 'node-fetch'

const communesGeojsonGet = geojson =>
  fetch(process.env.GEO_API_URL, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(geojson)
  })
    .then(async response => {
      const result = await response.json()

      if (response.status > 400) {
        throw result
      }

      return result
    })
    .catch(({ error }) => {
      const id = geojson.properties ? `(${geojson.properties.id}) ` : ''
      console.error(`communesGeojsonGet ${id}error: `, error)
      return []
    })

export default communesGeojsonGet
