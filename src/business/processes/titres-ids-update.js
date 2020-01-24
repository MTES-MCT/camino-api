import PQueue from 'p-queue'
import * as cryptoRandomString from 'crypto-random-string'
import * as slugify from '@sindresorhus/slugify'

import {
  titreIdUpdate as titreIdUpdateQuery,
  titreGet
} from '../../database/queries/titres'
import titreIdAndRelationsUpdate from '../utils/titre-id-and-relations-update'
import titreIdFind from '../utils/titre-id-find'

const titreIdHashAdd = hash => titre => slugify(`${titreIdFind(titre)}-${hash}`)

const titreIdCheck = async (titreOldId, titre) => {
  if (titreOldId !== titre.id) {
    const titreWithTheSameId = await titreGet(titre.id, { graph: null })

    if (titreWithTheSameId) {
      const hash = titre.doublonTitreId
        ? titreOldId.slice(-8)
        : cryptoRandomString({ length: 8 })

      titre.doublonTitreId = titre.id
      titre = titreIdAndRelationsUpdate(titre, titreIdHashAdd(hash))
    } else {
      titre.doublonTitreId = null
    }
  }

  return titre
}

const titreIdUpdate = async (titreOldId, titre) => {
  titre = await titreIdCheck(titreOldId, titre)

  await titreIdUpdateQuery(titreOldId, titre)

  // TODO: mettre à jour les documents ici

  console.log(`mise à jour: titre ids: ${titre.id}`)

  return titre
}

const titreIdsUpdate = async titre => {
  const titreOldId = titre.id

  // met à jour les ids par effet de bord
  const hasChanged = titreIdAndRelationsUpdate(titre)

  return hasChanged && titreIdUpdate(titreOldId, titre)
}

const titresIdsUpdate = async titresOld => {
  // attention
  // les transactions `titreIdUpdateQuery` ne peuvent pas être exécutées en parallèle
  // d'où le `for of`, pour traîter les titres un par un

  const titresUpdated = []
  const titresIdsUpdatedIndex = {}

  for (const titre of titresOld) {
    const titreOldId = titre.id

    // met à jour les ids par effet de bord
    const hasChanged = titreIdAndRelationsUpdate(titre)
    if (hasChanged) {
      try {
        const titreUpdated = await titreIdUpdate(titreOldId, titre)
        if (titreUpdated.id !== titreOldId) {
          titresIdsUpdatedIndex[titreUpdated.id] = titreOldId
        }

        titresUpdated.push(titreUpdated)
      } catch (e) {
        console.error(`erreur: titreOldIdUpdate ${titreOldId}`)
        console.error(e)
      }
    }
  }

  return { titresUpdated, titresIdsUpdatedIndex }
}

export { titresIdsUpdate, titreIdsUpdate }
