// https://api.insee.fr/catalogue/site/themes/wso2/subthemes/insee/pages/item-info.jag?name=Sirene&version=V3&provider=insee

import { join } from 'path'
import * as fetch from 'node-fetch'
import PQueue from 'p-queue'
import * as makeDir from 'make-dir'

import errorLog from '../error-log'
import fileCreate from '../file-create'

const CACHE_DIR = 'api-cache/insee/'
const MAX_CALLS_MINUTE = 30
const MAX_RESULTS = 20

// token local au fichier
// utiliser `initializeToken` pour l'initialiser
let apiToken

const { INSEE_API_URL, INSEE_API_KEY, INSEE_API_SECRET } = process.env

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
  }
}

const tokenFetch = async () => {
  try {
    if (!INSEE_API_URL) {
      throw new Error(
        "impossible de se connecter car la variable d'environnement est absente"
      )
    }

    console.info(
      `API Insee: récupération du token ${INSEE_API_KEY}:${INSEE_API_SECRET}`
    )

    const auth = Buffer.from(`${INSEE_API_KEY}:${INSEE_API_SECRET}`).toString(
      'base64'
    )

    const response = await fetch(`${INSEE_API_URL}/token`, {
      method: 'POST',
      body: 'grant_type=client_credentials',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${auth}`
      }
    })

    const result = await response.json()
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

const typeFetch = async (type, q) => {
  try {
    if (!INSEE_API_URL) {
      throw new Error(
        "API Insee: impossible de se connecter car la variable d'environnement est absente"
      )
    }

    console.info(`API Insee: requête ${type}, ids: ${q}`)

    const response = await fetch(
      `${INSEE_API_URL}/entreprises/sirene/V3/${type}/?q=${q}`,
      {
        credentials: 'include',
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${apiToken}`
        }
      }
    )

    const result = await response.json()

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
  }
}

const typeFetchDev = async (type, q, field, ids) => {
  await makeDir(CACHE_DIR)

  const cacheFilePath = join(
    CACHE_DIR,
    `insee-${field}-${ids.map(i => i.slice(-1)[0]).join('-')}.json`
  )

  try {
    const result = require(`../../../${cacheFilePath}`)

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

const typeMultiFetch = async (type, field, ids, q) => {
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
  }
}

const typeBatchFetch = async (type, field, ids, queryFormat) => {
  let batches = [ids]

  if (ids.length > MAX_RESULTS) {
    const count = Math.ceil(ids.length / MAX_RESULTS)

    batches = [...new Array(count)].map((e, i) =>
      ids.slice(i * MAX_RESULTS, (i + 1) * MAX_RESULTS)
    )
  }

  const batchesQueries = batches.reduce((acc, batch) => {
    acc.push(() => typeMultiFetch(type, field, batch, queryFormat(batch)))

    return acc
  }, [])

  const queue = new PQueue({ concurrency: 1 })

  const batchesResults = await queue.addAll(batchesQueries)

  return batchesResults.reduce((r, p) => {
    r.push(...p)

    return r
  }, [])
}

export { typeBatchFetch, tokenInitialize }
