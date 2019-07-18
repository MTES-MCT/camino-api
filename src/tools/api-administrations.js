// https://etablissements-publics.api.gouv.fr

import { join } from 'path'

import * as fetch from 'node-fetch'
import * as makeDir from 'make-dir'

import errorLog from './error-log'
import fileCreate from './file-create'

const RESPONSES_FOLDER = 'responses/administration/'
const MAX_CALLS_MINUTE = 200

const { ADMINISTRATION_API_URL } = process.env

const organismeUrlGet = (departementId, nom) => {
  return `${ADMINISTRATION_API_URL}/v3/departements/${departementId}/${nom}`
}

const organismeFetch = async (departementId, nom) => {
  console.info(`Appel d'API : ${departementId}, ${nom}`)

  const organismeUrl = organismeUrlGet(departementId, nom)

  const response = await fetch(organismeUrl, {
    method: 'GET',
    headers: {
      accept: 'application/json'
    }
  })

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
      await makeDir(RESPONSES_FOLDER)
      const cacheFilePath = join(
        RESPONSES_FOLDER,
        `organisme-${departementId}-${nom}`
      )

      try {
        result = require(`../../${cacheFilePath}.json`)
        console.info(
          `API Administration: lecture de l'organisme depuis le cache, département: ${departementId}, type: ${nom}`
        )
      } catch (e) {
        console.info(`API Administration: requête ${departementId}/${nom}`)

        result = await organismeFetch(departementId, nom)

        await fileCreate(
          `${cacheFilePath}.json`,
          JSON.stringify(result, null, 2)
        )
      }
    } else {
      result = await organismeFetch(departementId, nom)
    }

    return result
  } catch (err) {
    const error = err.error ? `${err.error}: ${err.error_description}` : err
    errorLog(`organisme call, error:`, error)
    throw error
  }
}

const organismeFormat = (e, departementId) => {
  const { properties: p } = e.features[0]
  const { adresses } = p

  let organisme
  try {
    let [adresse1, adresse2] = adresses

    adresse1 = adresse1.lignes
      .reduce((acc, line) => (line.length > 100 ? acc : [...acc, line]), [])
      .join(', ')

    adresse2 = adresse2 ? adresse2.lignes.join(', ') : null

    organisme = {
      id: p.id,
      typeId: p.pivotLocal.match(/^prefecture/) ? 'pre' : p.pivotLocal,
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

export { organismeDepartementGet }
