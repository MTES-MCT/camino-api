import * as fetch from 'node-fetch'
import chalk from 'chalk'

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
      console.error('')
      console.error(chalk.bgRed.black.bold(' erreur '))
      console.error(
        chalk.red.bold(
          `communesGeojsonGet ${JSON.stringify(geojson.properties)}:`,
          error
        )
      )
      console.error('')
    })

export default communesGeojsonGet
