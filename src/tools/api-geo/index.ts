import fetch from 'node-fetch'
import * as geojsonhint from '@mapbox/geojsonhint'
import errorLog from '../error-log'
import {
  IGeoJson,
  ICommune,
  IAreaId,
  IApiGeoResult,
  IForet,
  Index
} from '../../types'

const apiGeoFetch = async (
  path: string,
  geojson: IGeoJson,
  elements: IAreaId[]
) => {
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geojson)
      }
    )

    const result = await response.json()

    if (response.status >= 400) {
      throw result
    }

    return result as { [areaId in IAreaId]: Index<string | number>[] }
  } catch (e) {
    errorLog(`apiGeoFetch ${properties}`, e.error || e.message || e)

    return null
  }
}

const communeFormat = (commune: Index<string | number>) =>
  ({
    id: commune.code as string,
    nom: commune.nom as string,
    departementId: commune.departement as string,
    surface: commune.surface as number
  } as ICommune)

const foretFormat = (foret: Index<string | number>) =>
  ({
    id: foret.code as string,
    nom: foret.nom as string,
    surface: foret.surface as number
  } as IForet)

const apiGeoGet = async (
  geojson: IGeoJson,
  elements: IAreaId[]
): Promise<IApiGeoResult | null> => {
  const apiGeoResult = await apiGeoFetch('/', geojson, elements)

  if (!apiGeoResult) return null

  const areas = {} as IApiGeoResult

  if (apiGeoResult.communes) {
    areas.communes = apiGeoResult.communes.map(communeFormat)
  } else if (apiGeoResult.forets) {
    areas.forets = apiGeoResult.forets.map(foretFormat)
  }

  return areas
}

export { apiGeoGet }
