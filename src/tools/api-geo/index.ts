/// <reference types="../../@types/mapbox__geojsonhint" />
import fetch from 'node-fetch'
import geojsonhint from '@mapbox/geojsonhint'

import {
  IGeoJson,
  IAreaType,
  IApiGeoResult,
  IGeoJsonProperties,
  IArea
} from '../../types'
import errorLog from '../error-log'

const apiGeoFetch = async (geojson: IGeoJson, areasTypes: IAreaType[]) => {
  try {
    if (!process.env.API_GEO_URL) {
      throw new Error(
        "impossible de se connecter à l'API Géo Commune car la variable d'environnement est absente"
      )
    }

    if (!areasTypes || !areasTypes.length) {
      throw new Error(
        'impossible d’appeler l’API Géo Commune sans spécifier le ou les éléments souhaités'
      )
    }

    const geojsonErrors = geojsonhint.hint(geojson)
    if (geojsonErrors.length) {
      throw new Error(geojsonErrors.map(e => e.message).join('\n'))
    }

    const response = await fetch(
      `${process.env.API_GEO_URL}?elements=${areasTypes.join(',')}`,
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

    return result as { [areaType in IAreaType]: IGeoJsonProperties[] }
  } catch (e: any) {
    const properties = JSON.stringify(geojson.properties)
    errorLog(`apiGeoFetch ${properties}`, e.error || e.message || e)

    return null
  }
}

const areaFormat = (area: IGeoJsonProperties): IArea => ({
  id: area.code as string,
  nom: area.nom as string,
  surface: area.surface as number
})

const apiGeoGet = async (
  geojson: IGeoJson,
  areasTypes: IAreaType[]
): Promise<IApiGeoResult | null> => {
  const apiGeoResult = await apiGeoFetch(geojson, areasTypes)

  if (!apiGeoResult) return null

  const areas = {} as IApiGeoResult

  if (apiGeoResult.communes) {
    areas.communes = apiGeoResult.communes.map(area => {
      return { ...areaFormat(area), departementId: area.departement as string }
    })
  }

  if (apiGeoResult.forets) {
    areas.forets = apiGeoResult.forets.map(areaFormat)
  }

  if (apiGeoResult.sdomZones) {
    areas.sdomZones = apiGeoResult.sdomZones.map(areaFormat)
  }

  return areas
}

export { apiGeoGet }
