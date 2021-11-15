import 'dotenv/config'

import { apiGeoGet } from '../tools/api-geo'

const geojson = {
  type: 'Feature',
  properties: { id: 'test' },
  geometry: {
    type: 'MultiPolygon',
    coordinates: [
      [
        [
          [-54.1552756477881, 3.83264174696504],
          [-54.1553054008735, 3.82358131280288],
          [-54.1463302004929, 3.82355117414492],
          [-54.1463002531354, 3.83258458676135],
          [-54.1552756477881, 3.83264174696504]
        ]
      ]
    ]
  }
}

async function main() {
  const communes = await apiGeoGet(geojson, ['sdomZones'])

  console.info(communes)

  process.exit()
}

main()
