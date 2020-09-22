import fetch from 'node-fetch'
import * as geojsonhint from '@mapbox/geojsonhint'
import errorLog from '../error-log'
import {
  IGeoJson,
  ICommune,
  IAreaType,
  exhaustiveCheck,
  IApiGeoCommuneResult
} from '../../types'

const communesGeojsonFetch = async (
  path: string,
  geojson: IGeoJson,
  elements: IAreaType[]
): Promise<{ [areaType in IAreaType]: IGeoJson[] } | null> => {
  const properties = JSON.stringify(geojson.properties)

  try {
    if (!process.env.API_GEO_URL) {
      throw new Error(
        "impossible de se connecter à l'API Géo Commune car la variable d'environnement est absente"
      )
    }

    if (!elements || !elements.length) {
      throw new Error(
        'impossible d’appeler l’API Géo Commune sans spécifier le ou les éléments souhaités'
      )
    }

    const geojsonErrors = geojsonhint.hint(geojson)
    if (geojsonErrors.length) {
      throw new Error(geojsonErrors.map(e => e.message).join('\n'))
    }

    const response = await fetch(
      process.env.API_GEO_URL + path + '?elements=' + elements.join(','),
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(geojson)
      }
    )

    const result = await response.json()

    if (response.status >= 400) {
      throw result
    }

    return result
  } catch (e) {
    errorLog(`communesGeojsonGet ${properties}`, e.error || e.message || e)

    return null
  }
}

const communeFormat = (geojson: IGeoJson): ICommune => ({
  id: geojson.properties.code as string,
  nom: geojson.properties.nom as string,
  departementId: geojson.properties.departement as string,
  surface: geojson.properties.surface as number
})

export const geoAreaGeojsonGet = async (
  geojson: IGeoJson,
  elements: IAreaType[]
): Promise<IApiGeoCommuneResult | null> => {
  const communesGeojson = await communesGeojsonFetch('/', geojson, elements)
  if (!communesGeojson) return null

  return (Object.keys(communesGeojson) as IAreaType[]).reduce(
    (acc, areaType) => {
      const areas = communesGeojson[areaType as IAreaType]
      let areasFormatted
      if (areaType === 'communes') {
        areasFormatted = areas.map(communeFormat)
      } else {
        exhaustiveCheck(areaType)
      }

      return {
        ...acc,
        [areaType]: areasFormatted
      }
    },
    {}
  ) as IApiGeoCommuneResult
}
