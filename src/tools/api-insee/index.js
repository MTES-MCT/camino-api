import { join } from 'path'

import * as fetch from 'node-fetch'
import * as dateFormat from 'dateformat'

import errorLog from '../error-log'
import fileCreate from '../file-create'

import inseePays from './pays'
import inseeCategoriesJuridiques from './categories-juridiques'
import inseeTypesVoies from './voies'
const makeDir = require('make-dir')

const RESPONSES_FOLDER = 'responses/insee/'
const MAX_CALLS_MINUTE = 30
const MAX_RESULTS = 20

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

const tokenInitialize = async () => {
  try {
    let result

    if (process.env.NODE_ENV === 'development') {
      await makeDir(RESPONSES_FOLDER)
      const cacheFilePath = join(RESPONSES_FOLDER, `insee-token`)

      try {
        result = require(`../../../${cacheFilePath}.json`)
        console.info('API Insee: lecture du token depuis le cache')
      } catch (e) {
        console.info(`API Insee: création du token`)

        result = await tokenFetch()

        await fileCreate(
          `${cacheFilePath}.json`,
          JSON.stringify(result, null, 2)
        )
      }
    } else {
      result = await tokenFetch()
    }

    const token = result.access_token

    apiToken = token

    return token
  } catch (err) {
    const error = err.error ? `${err.error}: ${err.error_description}` : err
    errorLog(`insee token generate`, error)
  }
}

const inseeFetchMulti = async (type, field, ids, q) => {
  try {
    let result

    if (process.env.NODE_ENV === 'development') {
      await makeDir(RESPONSES_FOLDER)
      const cacheFilePath = join(
        RESPONSES_FOLDER,
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

  const batchesQueries = batches.reduce(
    async (acc, batch) => [
      ...(await acc),
      await inseeFetchMulti(type, field, batch, queryFormatter(batch))
    ],
    []
  )

  const batchesResults = await batchesQueries

  return batchesResults.reduce((r, p) => r.concat(p), [])
}

const nomEntrepriseFormat = (e, usuel) => {
  let denomination = usuel
    ? e.denominationUsuelle1UniteLegale &&
      e.denominationUsuelle1UniteLegale.trim()
    : e.denominationUniteLegale && e.denominationUniteLegale.trim()

  const sigle = e.sigleUniteLegale && e.sigleUniteLegale.trim()

  if (!denomination && !sigle) return null

  if (!denomination) return sigle

  if (!sigle || denomination === sigle) return denomination

  return `${denomination} (${sigle})`
}

const nomIndividuFormat = e =>
  `${e.sexeUniteLegale === 'F' ? 'MADAME' : 'MONSIEUR'} ${
    e.prenomUsuelUniteLegale
  } ${e.nomUniteLegale}`

const nomFormat = (e, usuel) =>
  e.nomUniteLegale && !usuel
    ? nomIndividuFormat(e)
    : nomEntrepriseFormat(e, usuel)

// regroupe les établissement en fonction du nom, suivant les périodes
const entrepriseEtablissementsFormat = (entrepriseId, e) =>
  e.periodesUniteLegale
    .reduce((acc, p) => {
      let nom = nomFormat({
        ...e,
        ...p
      })

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

const entrepriseHistoriqueFormat = e => {
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

  const nom = nomFormat(
    {
      ...e,
      ...unite
    },
    true
  )
  if (nom) {
    entreprise.nom = nom
  }

  if (unite.categorieEntreprise) {
    entreprise.categorie = unite.categorieEntreprise
  }

  if (adresse.codeCedexEtablissement) {
    entreprise.cedex = parseInt(adresse.codeCedexEtablissement)
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
    entreprise.codePostal = parseInt(adresse.codePostalEtablissement)
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
        `catégorie juridique introuvable : ${
          unite.categorieJuridiqueUniteLegale
        }`
      )
    }
  }

  if (adresse.codePaysEtrangerEtablissement) {
    let pays = inseePays.find(
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

const entrepriseHistoriqueGet = async sirenIds => {
  if (!sirenIds.length) return []

  const entreprisesHistoriques = await inseeTypeFetchBatch(
    'siren',
    'unitesLegales',
    sirenIds,
    idsBatch => idsBatch.map(s => `siren:${s}`).join(' OR ')
  )

  if (!entreprisesHistoriques || !Array.isArray(entreprisesHistoriques))
    return null

  return entreprisesHistoriques.reduce(
    (acc, e) => (e ? [...acc, ...entrepriseHistoriqueFormat(e)] : acc),
    []
  )
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

  return etablissements.reduce(
    (acc, e) => (e ? [...acc, entrepriseAdresseFormat(e)] : acc),
    []
  )
}

export { tokenInitialize, entrepriseHistoriqueGet, entrepriseAdresseGet }
