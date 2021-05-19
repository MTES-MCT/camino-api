// https://etablissements-publics.api.gouv.fr
import PQueue from 'p-queue'
import { join } from 'path'
import fetch from 'node-fetch'
import makeDir from 'make-dir'

import { IAdministration } from '../../types'

import errorLog from '../error-log'
import fileCreate from '../file-create'

const CACHE_DIR = 'api-cache/administration/'
const MAX_CALLS_MINUTE = 200

const { API_ADMINISTRATION_URL } = process.env

interface IOrganisme {
  features: {
    properties: {
      id: string
      pivotLocal: string
      nom: string
      telephone: string
      email: string
      url: string
      adresses: {
        lignes: string[]
        codePostal: string
        commune: string
      }[]
    }
  }[]
}

const organismeFetch = async (departementId: string, nom: string) => {
  if (!API_ADMINISTRATION_URL) {
    throw new Error(
      "impossible de se connecter à l'API administration car la variable d'environnement est absente"
    )
  }

  console.info(`API administration: requête ${departementId}, ${nom}`)

  const response = await fetch(
    `${API_ADMINISTRATION_URL}/v3/departements/${departementId}/${nom}`,
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

  const result = (await response.json()) as IOrganisme

  // attend quelques secondes après chaque appel
  // pour ne pas dépasser les quotas
  await new Promise(resolve =>
    setTimeout(resolve, (60 / MAX_CALLS_MINUTE) * 1000)
  )

  return result
}

const organismeDepartementCall = async (departementId: string, nom: string) => {
  try {
    let result

    if (process.env.NODE_ENV === 'development') {
      await makeDir(CACHE_DIR)
      const cacheFilePath = join(
        CACHE_DIR,
        `organisme-${departementId}-${nom}on`
      )

      try {
        result = require(`../../../${cacheFilePath}`) as IOrganisme
        console.info(
          `API Administration: lecture de l'organisme depuis le cache, département: ${departementId}, type: ${nom}`
        )
      } catch (e) {
        console.info(
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

    return null
  }
}

const organismeFormat = (e: IOrganisme, departementId: string) => {
  if (!e.features.length) return null

  const { properties: p } = e.features[0]
  const { adresses } = p

  let organisme
  try {
    const [adresseA, adresseB] = adresses

    const adresse1 = adresseA.lignes
      .reduce((acc: string[], line) => {
        if (line.length <= 100) {
          acc.push(line)
        }

        return acc
      }, [])
      .join(', ')

    const adresse2 = adresseB ? adresseB.lignes.join(', ') : null

    organisme = {
      id: p.id.replace(/prefecture|paris_ppp/, 'pre'),
      typeId: p.pivotLocal.replace(/prefecture|paris_ppp/, 'pre'),
      nom: p.nom,
      adresse1,
      adresse2,
      codePostal: adresses[0].codePostal,
      commune: adresses[0].commune,
      telephone: p.telephone,
      email: p.email && p.email.match('@') ? p.email : null,
      url: p.url || null,
      departementId
    } as IAdministration
  } catch (error) {
    console.error(p, organisme)
    throw error
  }

  return organisme
}

const organismeDepartementGet = async (departementId: string, nom: string) => {
  const organisme = await organismeDepartementCall(departementId, nom)

  return organisme ? organismeFormat(organisme, departementId) : null
}

const organismesDepartementsGet = async (
  departementsIdsNoms: { departementId: string; nom: string }[]
) => {
  const administrationsOrganismesRequests = departementsIdsNoms.map(
    ({ departementId, nom }) =>
      () =>
        organismeDepartementGet(departementId, nom)
  )

  const queue = new PQueue({ concurrency: 10 })

  const organismesDepartements = await queue.addAll(
    administrationsOrganismesRequests
  )

  return organismesDepartements.filter(o => o) as IAdministration[]
}

export { organismeDepartementGet, organismesDepartementsGet }
