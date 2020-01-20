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

  // TODO
  // mettre à jour les documents ici

  console.log(`mise à jour: titre ids: ${titre.id}`)

  return titre
}

const titreIdsUpdate = async titreOld => {
  const titre = titreIdAndRelationsUpdate(titreOld, titreIdFind)

  return titre && titreIdUpdate(titreOld.id, titre)
}

const titresIdsUpdate = async titresOld => {
  // attention
  // les transactions `titreIdUpdateQuery` ne peuvent pas être exécutées en parallèle
  // donc on limite la concurrence à 1
  const queue = new PQueue({ concurrency: 1 })

  const queueElements = titresOld.reduce((queueElements, titreOld) => {
    const titre = titreIdAndRelationsUpdate(titreOld, titreIdFind)

    if (titre) {
      queueElements.push(async () => {
        try {
          const titreUpdated = await titreIdUpdate(titreOld.id, titre)
          const titreUpdatedIdsIndex =
            titreUpdated.id !== titreOld.id
              ? { [titreUpdated.id]: titreOld.id }
              : null

          return { titreUpdatedIdsIndex, titreUpdated }
        } catch (e) {
          console.error(`erreur: titreIdUpdate ${titreOld.id}`)
          console.error(e)
        }
      })
    }

    return queueElements
  }, [])

  const res = await queue.addAll(queueElements)

  const { titresUpdated, titresUpdatedIdsIndex } = res.reduce(
    (
      { titresUpdated, titresUpdatedIdsIndex },
      { titreUpdatedIdsIndex, titreUpdated } = {}
    ) => {
      if (titreUpdatedIdsIndex) {
        titresUpdatedIdsIndex = Object.assign(
          titresUpdatedIdsIndex,
          titreUpdatedIdsIndex
        )
      }

      if (titreUpdated) {
        titresUpdated.push(titreUpdated)
      }

      return { titresUpdated, titresUpdatedIdsIndex }
    },
    { titresUpdated: [], titresUpdatedIdsIndex: {} }
  )

  return { titresUpdated, titresUpdatedIdsIndex }
}

export { titresIdsUpdate, titreIdsUpdate }
