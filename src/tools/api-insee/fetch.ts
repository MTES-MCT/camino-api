// https://api.insee.fr/catalogue/site/themes/wso2/subthemes/insee/pages/item-info.jag?name=Sirene&version=V3&provider=insee

import {
  IApiSirenQueryTypes,
  IApiSirenQueryToken,
  IApiSirenEtablissement,
  IApiSirenUniteLegale
} from './types'

import { join } from 'path'
import fetch from 'node-fetch'
import PQueue from 'p-queue'
import * as makeDir from 'make-dir'

import errorLog from '../error-log'
import fileCreate from '../file-create'

const CACHE_DIR = 'api-cache/insee/'
const MAX_CALLS_MINUTE = 30
const MAX_RESULTS = 20

// token local au fichier
// utilise `tokenInitialize` pour l'initialiser
let apiToken = ''

const { API_INSEE_URL, API_INSEE_KEY, API_INSEE_SECRET } = process.env

const TEST_SIREN_ID = '805296415'

const tokenTest = async () => {
  console.info('API Insee: requête de test du token sur /siren')
  const res = await typeFetch('siren', `siren:${TEST_SIREN_ID}`)
  if (!res) {
    throw new Error('pas de résultat pour la requête de test')
  }
}

const tokenInitialize = async () => {
  if (apiToken) return apiToken

  try {
    const result =
      process.env.NODE_ENV === 'development'
        ? await tokenFetchDev()
        : await tokenFetch()

    apiToken = result && result.access_token

    if (!apiToken) {
      throw new Error('pas de token après requête')
    }

    await tokenTest()

    return apiToken
  } catch (e) {
    errorLog(
      "API Insee: impossible de générer le token de l'API INSEE ",
      (e.header && e.header.message) ||
        (e.fault && `${e.fault.message}: ${e.fault.description}`) ||
        (e.error && `${e.error}: ${e.error_description}`) ||
        e.message ||
        e
    )

    return null
  }
}

const tokenFetch = async () => {
  try {
    if (!API_INSEE_URL) {
      throw new Error(
        "impossible de se connecter car la variable d'environnement est absente"
      )
    }

    console.info(
      `API Insee: récupération du token ${API_INSEE_KEY}:${API_INSEE_SECRET}`
    )

    const auth = Buffer.from(`${API_INSEE_KEY}:${API_INSEE_SECRET}`).toString(
      'base64'
    )

    const response = await fetch(`${API_INSEE_URL}/token`, {
      method: 'POST',
      body: 'grant_type=client_credentials',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${auth}`
      }
    })

    const result = (await response.json()) as IApiSirenQueryToken

    if (response.status >= 400 || result.error) {
      throw result
    }

    if (!result) {
      throw new Error('contenu de la réponse vide')
    }

    return result
  } catch (e) {
    errorLog(
      `API Insee: tokenFetch `,
      (e.header && e.header.message) ||
        (e.fault && `${e.fault.message}: ${e.fault.description}`) ||
        (e.error && `${e.error}: ${e.error_description}`) ||
        e.message ||
        e
    )

    return null
  }
}

const tokenFetchDev = async () => {
  await makeDir(CACHE_DIR)

  const cacheFilePath = join(CACHE_DIR, `insee-token.json`)

  try {
    const result = require(`../../../${cacheFilePath}`)

    console.info('API Insee: lecture du token depuis le cache', cacheFilePath)

    if (!result) {
      throw new Error('API Insee: pas de token dans le cache')
    }

    apiToken = result && result.access_token

    console.info('API Insee: requête de test pour le token du cache')

    return result
  } catch (e) {
    errorLog(`API Insee: tokenFetchDev `, e.message)

    console.info(`API Insee: création du token`)

    const result = await tokenFetch()
    if (!result) {
      throw new Error('API Insee: pas de token retourné')
    }

    await fileCreate(cacheFilePath, JSON.stringify(result, null, 2))

    return result
  }
}

const typeFetch = async (type: 'siren' | 'siret', q: string) => {
  try {
    if (!API_INSEE_URL) {
      throw new Error(
        "API Insee: impossible de se connecter car la variable d'environnement est absente"
      )
    }

    console.info(`API Insee: requête ${type}, ids: ${q}`)

    const response = await fetch(
      `${API_INSEE_URL}/entreprises/sirene/V3/${type}/?q=${q}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${apiToken}`
        }
      }
    )

    const result = (await response.json()) as IApiSirenQueryTypes

    if (
      response.status >= 400 ||
      (result.fault && result.fault.code === 900804)
    ) {
      throw result
    }

    if (!result) {
      throw new Error('API Insee: contenu de la réponse vide')
    }

    // attend quelques secondes après chaque appel
    // pour ne pas dépasser les quotas
    await new Promise(resolve =>
      setTimeout(resolve, (60 / MAX_CALLS_MINUTE) * 1000)
    )

    return result
  } catch (e) {
    errorLog(
      `API Insee: typeFetch `,
      (e.header && e.header.message) ||
        (e.fault && `${e.fault.message}: ${e.fault.description}`) ||
        (e.error && `${e.error}: ${e.error_description}`) ||
        e.message ||
        e
    )

    return null
  }
}

const typeFetchDev = async (
  type: 'siren' | 'siret',
  q: string,
  field: 'etablissements' | 'unitesLegales',
  ids: string[]
) => {
  await makeDir(CACHE_DIR)

  const cacheFilePath = join(
    CACHE_DIR,
    `insee-${field}-${ids.map(id => id.slice(-1)[0]).join('-')}.json`
  )

  try {
    const result = require(`../../../${cacheFilePath}`) as IApiSirenQueryTypes

    console.info(`API Insee: lecture de ${type} depuis le cache, ids: ${ids}`)

    return result
  } catch (e) {
    errorLog(`API Insee: typeFetchDev `, e.message)

    console.info(`API Insee: requête de ${type}`)

    const result = await typeFetch(type, q)

    await fileCreate(cacheFilePath, JSON.stringify(result, null, 2))

    return result
  }
}

const typeMultiFetch = async (
  type: 'siren' | 'siret',
  field: 'etablissements' | 'unitesLegales',
  ids: string[],
  q: string
) => {
  try {
    const result =
      process.env.NODE_ENV === 'development'
        ? await typeFetchDev(type, q, field, ids)
        : await typeFetch(type, q)

    return (result && result[field]) || []
  } catch (e) {
    errorLog(
      `API Insee: ${type} get ${ids.join(', ')}`,
      JSON.stringify(
        (e.header && e.header.message) ||
          (e.fault && `${e.fault.message}: ${e.fault.description}`) ||
          (e.error && `${e.error}: ${e.error_description}`) ||
          e.message ||
          e
      )
    )

    return null
  }
}

const batchesBuild = (ids: string[]) => {
  if (ids.length <= MAX_RESULTS) return [ids]

  const count = Math.ceil(ids.length / MAX_RESULTS)

  return [...new Array(count)].map((e, i) =>
    ids.slice(i * MAX_RESULTS, (i + 1) * MAX_RESULTS)
  )
}

const entreprisesEtablissementsFetch = async (ids: string[]) => {
  const batches = batchesBuild(ids)

  const queryFormat = (idsBatch: string[]) =>
    idsBatch.map(batch => `siren:${batch}`).join(' OR ')

  const batchesQueries = batches.reduce(
    (acc: (() => Promise<IApiSirenUniteLegale[] | null>)[], batch) => {
      acc.push(
        () =>
          typeMultiFetch(
            'siren',
            'unitesLegales',
            batch,
            queryFormat(batch)
          ) as Promise<IApiSirenUniteLegale[] | null>
      )

      return acc
    },
    []
  )

  const queue = new PQueue({ concurrency: 1 })

  const batchesResults = await queue.addAll(batchesQueries)

  return batchesResults.reduce((r: IApiSirenUniteLegale[], p) => {
    if (p) r.push(...p)

    return r
  }, [])
}

const entreprisesFetch = async (ids: string[]) => {
  const batches = batchesBuild(ids)

  const queryFormat = (idsBatch: string[]) => {
    const ids = idsBatch.map(batch => `siren:${batch}`).join(' OR ')

    return `(${ids}) AND etablissementSiege:true`
  }

  const batchesQueries = batches.reduce(
    (acc: (() => Promise<IApiSirenEtablissement[] | null>)[], batch) => {
      acc.push(
        () =>
          typeMultiFetch(
            'siret',
            'etablissements',
            batch,
            queryFormat(batch)
          ) as Promise<IApiSirenEtablissement[] | null>
      )

      return acc
    },
    []
  )

  const queue = new PQueue({ concurrency: 1 })
  const batchesResults = await queue.addAll(batchesQueries)

  return batchesResults.reduce((r: IApiSirenEtablissement[], p) => {
    if (p) r.push(...p)

    return r
  }, [])
}

export { entreprisesFetch, entreprisesEtablissementsFetch, tokenInitialize }
