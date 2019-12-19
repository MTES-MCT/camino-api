// https://etablissements-publics.api.gouv.fr
import PQueue from 'p-queue'
import { join } from 'path'

import * as fetch from 'node-fetch'
import * as makeDir from 'make-dir'

import errorLog from '../error-log'
import fileCreate from '../file-create'

const CACHE_DIR = 'api-cache/administration/'
const MAX_CALLS_MINUTE = 200

const { ADMINISTRATION_API_URL } = process.env

const organismeFetch = async (departementId, nom) => {
  if (!ADMINISTRATION_API_URL) {
    throw new Error(
      "impossible de se connecter à l'API administration car la variable d'environnement est absente"
    )
  }

  console.info(`API administration: requête ${departementId}, ${nom}`)

  const response = await fetch(
    `${ADMINISTRATION_API_URL}/v3/departements/${departementId}/${nom}`,
    {
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
    }
  )

  if (response.status > 400) {
    throw response.statusText
  }

  const result = await response.json()

  // attend quelques secondes après chaque appel
  // pour ne pas dépasser les quotas
  await new Promise((resolve, reject) =>
    setTimeout(resolve, (60 / MAX_CALLS_MINUTE) * 1000)
  )

  return result
}

const organismeDepartementCall = async (departementId, nom) => {
  try {
    let result

    if (process.env.NODE_ENV === 'development') {
      await makeDir(CACHE_DIR)
      const cacheFilePath = join(
        CACHE_DIR,
        `organisme-${departementId}-${nom}.json`
      )

      try {
        result = require(`../../../${cacheFilePath}`)
        console.info(
          `API Administration: lecture de l'organisme depuis le cache, département: ${departementId}, type: ${nom}`
        )
      } catch (e) {
        console.log(
          `API Administration: pas de fichier de cache ${cacheFilePath}`
        )

        result = await organismeFetch(departementId, nom)

        await fileCreate(cacheFilePath, JSON.stringify(result, null, 2))
      }
    } else {
      result = await organismeFetch(departementId, nom)
    }

    return result
  } catch (err) {
    const error = err.error ? `${err.error}: ${err.error_description}` : err
    errorLog(`API administrations ${departementId} ${nom}:`, error)
  }
}

const organismeFormat = (e, departementId) => {
  if (!e.features.length) return null

  const { properties: p } = e.features[0]
  const { adresses } = p

  let organisme
  try {
    let [adresse1, adresse2] = adresses

    adresse1 = adresse1.lignes
      .reduce((acc, line) => {
        if (line.length <= 100) {
          acc.push(line)
        }

        return acc
      }, [])
      .join(', ')

    adresse2 = adresse2 ? adresse2.lignes.join(', ') : null

    organisme = {
      id: p.id,
      typeId: p.pivotLocal.match(/^(prefecture|paris_ppp)/)
        ? 'pre'
        : p.pivotLocal,
      nom: p.nom,
      adresse1,
      adresse2,
      codePostal: adresses[0].codePostal,
      commune: adresses[0].commune,
      telephone: p.telephone,
      email: p.email && p.email.match('@') ? p.email : null,
      url: p.url || null,
      departementId
    }
  } catch (error) {
    console.error(p, organisme)
    throw error
  }

  return organisme
}

const organismeDepartementGet = async (departementId, nom) => {
  if (!departementId || !nom) return null

  const organisme = await organismeDepartementCall(departementId, nom)

  //  return organisme
  return organisme ? organismeFormat(organisme, departementId) : null
}

const organismesDepartementsGet = async departementsIdsNoms => {
  const administrationsOrganismesRequests = departementsIdsNoms.map(
    ({ departementId, nom }) => () =>
      organismeDepartementGet(departementId, nom)
  )

  const queue = new PQueue({ concurrency: 10 })

  return queue.addAll(administrationsOrganismesRequests)
}

export { organismeDepartementGet, organismesDepartementsGet }
