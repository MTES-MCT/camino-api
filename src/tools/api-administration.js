import * as fetch from 'node-fetch'
import * as dateFormat from 'dateformat'

import errorLog from './error-log'
import fileCreate from './file-create'

const RESPONSES_FOLDER = 'responses/administration'
const MAX_CALLS_MINUTE = 200
const MAX_RESULTS = 20

const { ADMINISTRATION_API_URL } = process.env

// token local au fichier
// utiliser `initializeToken` pour l'initialiser
let apiToken

const organismeUrlGet = (departement, nom) => {
  return `${ADMINISTRATION_API_URL}/v1/organismes/${departement}/${nom}`
}

const organismeFetch = async (departement, nom) => {
  console.info(`Appel d'API : ${departement}, ${nom}`)

  const organismeUrl = organismeUrlGet(departement, nom)

  console.log({ organismeUrl })

  const response = await fetch(organismeUrl, {
    method: 'GET',
    headers: {
      accept: 'application/json'
    }
  })

  console.log('status:', response.status)

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

const organismeCall = async (departement, nom) => {
  try {
    let result

    if (process.env.NODE_ENV === 'development') {
      const cacheFilePath = `${RESPONSES_FOLDER}/organisme-${departement}-${nom}`

      try {
        result = require(`../../${cacheFilePath}.json`)
      } catch (e) {
        console.info(
          `Pas de fichier de cache pour ${departement}/${nom} dans \`${RESPONSES_FOLDER}\`, appel d'API`
        )

        result = await organismeFetch(departement, nom)

        await fileCreate(
          cacheFilePath + '.json',
          JSON.stringify(result, null, 2)
        )
      }
    } else {
      result = await organismeFetch(departement, nom)
    }

    return result
  } catch (err) {
    const error = err.error ? `${err.error}: ${err.error_description}` : err
    errorLog(`organisme call, error:`, error)
  }
}

const organismeFormat = e => {
  const { properties: p } = e.features[0]
  let { Adresse: adresses, CoordonnéesNum: coordonnees } = p

  let organisme
  try {
    adresses = Array.isArray(adresses) ? adresses : [adresses]

    let [adresse1, adresse2] = adresses

    adresse1 = Array.isArray(adresse1.Ligne)
      ? adresse1.Ligne.join(', ')
      : adresse1.Ligne

    adresse2 = !adresse2
      ? null
      : Array.isArray(adresse2.Ligne)
        ? adresse2.Ligne.join(', ')
        : adresse2.Ligne

    const telephone = coordonnees.Téléphone
      ? (coordonnees.Téléphone.$t || coordonnees.Téléphone).replace(/ /g, '')
      : null

    organisme = {
      id: p.id,
      nom: p.Nom,
      service: p.pivotLocal,
      adresse1,
      adresse2,
      codePostal: adresses[0].CodePostal,
      commune: adresses[0].NomCommune,
      telephone,
      email: coordonnees.Email,
      site: coordonnees.Url,

      codeInsee: p.codeInsee,
      dateMiseAJour: p.dateMiseAJour
    }

    if (p.id === 'prefecture-68066-01') {
      //console.log(adresses)
      //throw new Error('coucou')
    }
  } catch (error) {
    console.error(p, organisme)
    throw error
  }

  return organisme
}

const organismeGet = async (departement, nom) => {
  if (!departement || !nom) return null

  const organisme = await organismeCall(departement, nom)
  return organisme
  return organisme ? organismeFormat(organisme) : null
}

export { organismeGet }
