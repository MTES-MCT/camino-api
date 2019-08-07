// https://api.insee.fr/catalogue/site/themes/wso2/subthemes/insee/pages/item-info.jag?name=Sirene&version=V3&provider=insee

import { join } from 'path'

import * as fetch from 'node-fetch'
import * as dateFormat from 'dateformat'

import errorLog from '../error-log'
import fileCreate from '../file-create'

import inseePays from './pays'
import inseeCategoriesJuridiques from './categories-juridiques'
import inseeTypesVoies from './voies'
import PQueue from 'p-queue'

const makeDir = require('make-dir')

const CACHE_DIR = 'api-cache/insee/'
const MAX_CALLS_MINUTE = 30
const MAX_RESULTS = 20

const TEST_SIREN_ID = '805296415'

const { INSEE_API_URL, INSEE_API_KEY, INSEE_API_SECRET } = process.env

// token local au fichier
// utiliser `initializeToken` pour l'initialiser
let apiToken

const inseeTokenQuery = () => `${INSEE_API_URL}/token`

const inseeMultiIdsSearch = (type, q) => {
  return `${INSEE_API_URL}/entreprises/sirene/V3/${type}/?q=${q}`
}

const tokenFetch = async () => {
  console.info('API Insee: récupération du token')

  console.log('auth:', `${INSEE_API_KEY}:${INSEE_API_SECRET}`)

  const auth = Buffer.from(`${INSEE_API_KEY}:${INSEE_API_SECRET}`).toString(
    'base64'
  )

  const response = await fetch(inseeTokenQuery(), {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${auth}`
    }
  })

  const result = await response.json()
  if (response.status > 400 || !result || result.error) {
    throw result
  }

  return result
}

const inseeFetch = async (type, q) => {
  console.info(`API Insee: ${type}, ids: ${q}`)

  const response = await fetch(inseeMultiIdsSearch(type, q), {
    credentials: 'include',
    method: 'GET',
    headers: {
      accept: 'application/json',
      authorization: `Bearer ${apiToken}`
    }
  })

  const result = await response.json()

  if (response.status > 400 || (result.fault && result.fault.code === 900804)) {
    throw result
  }

  // attend quelques secondes après chaque appel
  // pour ne pas dépasser les quotas
  await new Promise((resolve, reject) =>
    setTimeout(resolve, (60 / MAX_CALLS_MINUTE) * 1000)
  )

  return result
}

const tokenFetchDev = async () => {
  let result

  await makeDir(CACHE_DIR)

  const cacheFilePath = join(CACHE_DIR, `insee-token`)

  try {
    result = require(`../../../${cacheFilePath}.json`)
    console.info('API Insee: lecture du token depuis le cache')

    apiToken = result && result.access_token

    console.info('Requête de test du token sur /siren')
    await entrepriseAdresseGet([TEST_SIREN_ID])
  } catch (e) {
    console.info(`API Insee: création du token`)

    result = await tokenFetch()

    await fileCreate(`${cacheFilePath}.json`, JSON.stringify(result, null, 2))
  }

  return result
}

const tokenInitialize = async () => {
  try {
    const result =
      process.env.NODE_ENV === 'development'
        ? await tokenFetchDev()
        : await tokenFetch()

    apiToken = result && result.access_token

    return apiToken
  } catch (err) {
    const error = err.error ? `${err.error}: ${err.error_description}` : err
    errorLog(`insee token generate`, error)
  }
}

const inseeFetchMulti = async (type, field, ids, q) => {
  try {
    let result

    if (process.env.NODE_ENV === 'development') {
      await makeDir(CACHE_DIR)
      const cacheFilePath = join(
        CACHE_DIR,
        `insee-${field}-${ids.map(i => i.slice(-1)[0]).join('-')}`
      )

      try {
        result = require(`../../../${cacheFilePath}.json`)
        console.info(
          `API Insee: lecture de ${type} depuis le cache, ids: ${ids}`
        )
      } catch (e) {
        console.info(`API Insee: requête de ${type}`)

        result = await inseeFetch(type, q)

        await fileCreate(
          `${cacheFilePath}.json`,
          JSON.stringify(result, null, 2)
        )
      }
    } else {
      result = await inseeFetch(type, q)
    }

    return result && result[field] ? result[field] : []
  } catch (err) {
    const error = err.error ? err.error : err
    errorLog(`insee ${type} get ${ids.join(', ')}`, JSON.stringify(error))
    throw error
  }
}

const inseeTypeFetchBatch = async (type, field, ids, queryFormatter) => {
  let batches = [ids]

  if (ids.length > MAX_RESULTS) {
    const count = Math.ceil(ids.length / MAX_RESULTS)

    batches = [...new Array(count)].map((e, i) =>
      ids.slice(i * MAX_RESULTS, (i + 1) * MAX_RESULTS)
    )
  }

  const batchesQueries = batches.reduce((acc, batch) => {
    acc.push(() => inseeFetchMulti(type, field, batch, queryFormatter(batch)))

    return acc
  }, [])

  const queue = new PQueue({ concurrency: 10 })

  const batchesResults = await queue.addAll(batchesQueries)

  return batchesResults.reduce((r, p) => {
    r.push(...p)

    return r
  }, [])
}

const nomEntrepriseFormat = (e, usuel) => {
  const denomination =
    e.denominationUniteLegale && e.denominationUniteLegale.trim()

  const denominationUsuelle =
    e.denominationUsuelle1UniteLegale &&
    e.denominationUsuelle1UniteLegale.trim()

  const sigle = e.sigleUniteLegale && e.sigleUniteLegale.trim()

  // priorise la dénomination officielle
  // par rapport à la dénomination usuelle
  const nom = denomination || denominationUsuelle

  if (!nom && !sigle) return null

  // si le nom n'est pas rempli, retourne le sigle
  if (!nom) return sigle

  // si le sigle est rempli
  // et qu'il est différent du nom
  if (sigle && nom !== sigle) {
    // alors concatène le nom et le sigle (différent du nom)
    return `${nom} (${sigle})`
  }

  return nom
}

const nomIndividuFormat = e =>
  `${e.sexeUniteLegale === 'F' ? 'MADAME' : 'MONSIEUR'} ${
    e.prenomUsuelUniteLegale
  } ${e.nomUniteLegale}`

// eslint-disable-next-line jsdoc/require-description
/**
 * @description Formate le nom d'une entreprise ou établissement.
 *
 * @param {object} e - L'entité à formater.
 * @param {boolean} usuel - Récupère le nom usuel ou non
 *     si usuel est `true` et que l'entité est une personne
 *     alors format le nom comme une entreprise.
 * @returns {string} Le nom de l'entreprise.
 *
 */
const nomFormat = (e, usuel) =>
  e.nomUniteLegale && !usuel
    ? nomIndividuFormat(e)
    : nomEntrepriseFormat(e, usuel)

// regroupe les établissement en fonction du nom, suivant les périodes
const entrepriseEtablissementsFormat = (entrepriseId, e) =>
  e.periodesUniteLegale
    .reduce((acc, p) => {
      const nom = nomFormat(Object.assign({}, e, p))

      let previous = acc[acc.length - 1]

      if (!previous || !previous[0] || previous[0].nom !== nom) {
        previous = []
        acc.push(previous)
      }

      const nic = p.nicSiegeUniteLegale || 'xxxxx'

      const dateDebut = dateFormat(p.dateDebut, 'yyyy-mm-dd')

      const etablissement = {
        id: `${entrepriseId}-${nic}-${dateDebut}`,
        entrepriseId,
        nom,
        dateDebut,
        legalSiret: `${e.siren}${nic}`
      }
      if (p.dateFin) {
        etablissement.dateFin = dateFormat(p.dateFin, 'yyyy-mm-dd')
      }

      previous.push(etablissement)

      return acc
    }, [])
    // corrige la date de début de la période
    .map(periodesEtablissements => {
      const first = periodesEtablissements[0]

      if (periodesEtablissements.length > 1) {
        first.dateDebut = periodesEtablissements.slice(-1)[0].dateDebut
      }

      return first
    })

const entrepriseEtablissementFormat = e => {
  if (!e) return null

  const entrepriseId = `fr-${e.siren}`

  // periodesUniteLegale est un tableau
  // classé par ordre de fin chronologique décroissant
  return e.periodesUniteLegale && e.periodesUniteLegale.length
    ? entrepriseEtablissementsFormat(entrepriseId, e)
    : []
}

const entrepriseAdresseFormat = e => {
  if (!e) return null

  const { uniteLegale: unite, adresseEtablissement: adresse } = e

  const id = `fr-${e.siren}`

  const entreprise = {
    id,
    legalSiren: e.siren
  }

  const nom = nomFormat(Object.assign({}, e, unite), true)
  if (nom) {
    entreprise.nom = nom
  }

  if (unite.categorieEntreprise) {
    entreprise.categorie = unite.categorieEntreprise
  }

  if (adresse.codeCedexEtablissement) {
    entreprise.cedex = adresse.codeCedexEtablissement
  }

  entreprise.adresse = ''

  if (adresse.numeroVoieEtablissement) {
    entreprise.adresse += `${adresse.numeroVoieEtablissement} `
  }

  if (adresse.indiceRepetitionEtablissement) {
    entreprise.adresse += `${adresse.indiceRepetitionEtablissement} `
  }

  if (adresse.typeVoieEtablissement) {
    const typeVoie = inseeTypesVoies.find(
      t => t.id === adresse.typeVoieEtablissement
    )
    if (typeVoie) {
      entreprise.adresse += `${typeVoie.nom} `
    }
  }

  if (adresse.libelleVoieEtablissement) {
    entreprise.adresse += `${adresse.libelleVoieEtablissement} `
  }

  if (adresse.codePostalEtablissement) {
    entreprise.codePostal = adresse.codePostalEtablissement
  }

  const commune =
    adresse.libelleCommuneEtablissement ||
    adresse.libelleCommuneEtrangerEtablissement

  if (commune) {
    entreprise.commune = commune
  }

  if (unite.categorieJuridiqueUniteLegale) {
    const categorie = inseeCategoriesJuridiques.find(
      c => c.code === unite.categorieJuridiqueUniteLegale
    )
    if (categorie) {
      entreprise.legalForme = categorie.nom
    } else {
      console.error(
        `catégorie juridique introuvable : ${unite.categorieJuridiqueUniteLegale}`
      )
    }
  }

  if (adresse.codePaysEtrangerEtablissement) {
    const pays = inseePays.find(
      p => p.cog === adresse.codePaysEtrangerEtablissement
    )
    if (pays) {
      entreprise.paysId = pays.codeiso2
    } else {
      console.error(
        `code pays introuvable: ${adresse.codePaysEtrangerEtablissement}`
      )
    }
  } else {
    entreprise.paysId = 'FR'
  }

  if (unite.dateCreationUniteLegale) {
    entreprise.dateCreation = dateFormat(
      unite.dateCreationUniteLegale,
      'yyyy-mm-dd'
    )
  }

  return entreprise
}

const entrepriseEtablissementGet = async sirenIds => {
  if (!sirenIds.length) return []

  const entreprisesEtablissements = await inseeTypeFetchBatch(
    'siren',
    'unitesLegales',
    sirenIds,
    idsBatch => idsBatch.map(s => `siren:${s}`).join(' OR ')
  )

  if (!entreprisesEtablissements || !Array.isArray(entreprisesEtablissements))
    return null

  return entreprisesEtablissements.reduce((acc, e) => {
    if (e) {
      acc.push(...entrepriseEtablissementFormat(e))
    }

    return acc
  }, [])
}

const entrepriseAdresseGet = async sirenIds => {
  const etablissements = await inseeTypeFetchBatch(
    'siret',
    'etablissements',
    sirenIds,
    idsBatch => {
      const ids = idsBatch.map(s => `siren:${s}`).join(' OR ')

      return `(${ids}) AND etablissementSiege:true`
    }
  )
  if (!etablissements || !Array.isArray(etablissements)) return null

  return etablissements.reduce((acc, e) => {
    if (e) {
      acc.push(entrepriseAdresseFormat(e))
    }

    return acc
  }, [])
}

export { tokenInitialize, entrepriseEtablissementGet, entrepriseAdresseGet }
