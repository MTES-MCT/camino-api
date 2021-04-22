import proj4 from 'proj4'

import { IGeoSysteme } from '../../types'

import { geoSystemesGet } from '../queries/metas'

let geoSystemes = [] as IGeoSysteme[]

const geoSystemesInit = async () => {
  geoSystemes = await geoSystemesGet()

  // initialise les définitions proj4
  // utilisées dans /tools/geo-convert
  proj4.defs(
    geoSystemes.map(geoSysteme => [
      `EPSG:${geoSysteme.id}`,
      geoSysteme.definitionProj4
    ])
  )
}

export { geoSystemes, geoSystemesInit }
