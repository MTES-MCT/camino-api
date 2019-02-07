import 'dotenv/config'
import '../../../database/index'
import { titreEtapeGet } from '../../../database/queries/titres-etapes'

import geojsonCommunesGet from '../../api-communes'

import { geojsonFeatureMultiPolygon } from '../../geojson'

import { titreEtapeCommunesInsert } from '../../../tasks/titre-etapes'

async function main() {
  const titreEtapeId = 'h-cxx-saint-marcet-1943-oct01-dpu01'

  const titreEtape = await titreEtapeGet(titreEtapeId)

  const geojson = geojsonFeatureMultiPolygon(titreEtape.points)

  const geojsonCommunes = await geojsonCommunesGet(geojson)

  const communesIds = geojsonCommunes.map(geojson => geojson.properties.code)

  const titresEtapesCommunes = await titreEtapeCommunesInsert(
    titreEtape,
    communesIds
  )

  console.log(titresEtapesCommunes)

  process.exit()
}

main()
