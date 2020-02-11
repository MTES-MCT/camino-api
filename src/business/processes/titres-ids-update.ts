import { ITitres } from '../../types'

import * as cryptoRandomString from 'crypto-random-string'
import * as slugify from '@sindresorhus/slugify'

import PQueue from 'p-queue'

import {
  titreIdUpdate as titreIdUpdateQuery,
  titreGet
} from '../../database/queries/titres'
import titreIdAndRelationsUpdate from '../utils/titre-id-and-relations-update'
import titreIdFind from '../utils/titre-id-find'
import { titreFichiersRename } from './titre-fichiers-rename'

const titreIdFindHashAdd = (hash: string) => (titre: ITitres) =>
  slugify(`${titreIdFind(titre)}-${hash}`)

const titreIdCheck = async (titreOldId: string, titre: ITitres) => {
  if (titreOldId !== titre.id) {
    const titreWithTheSameId = await titreGet(titre.id, { graph: '' })

    if (titreWithTheSameId) {
      const hash = titre.doublonTitreId
        ? titreOldId.slice(-8)
        : cryptoRandomString({ length: 8 })

      titre.doublonTitreId = titre.id
      titre = titreIdAndRelationsUpdate(titre, titreIdFindHashAdd(hash))
    } else {
      delete titre.doublonTitreId
    }
  }

  return titre
}

const titreIdUpdate = async (titreOldId: string, titre: ITitres) => {
  titre = await titreIdCheck(titreOldId, titre)

  await titreIdUpdateQuery(titreOldId, titre)

  await titreFichiersRename(titreOldId, titre)

  console.log(`mise à jour: titre ids: ${titre.id}`)

  return titre
}

const titreIdsUpdate = async (titre: ITitres) => {
  // les transaction en bdd ne peuvent pas être effectuées en parallèle
  // comment ça va se passer si plusieurs utilisateurs modifient un titre en même temps

  const titreOldId = titre.id
  try {
    // met à jour les ids par effet de bord
    titre = titreIdAndRelationsUpdate(titre)

    if (!titre) return null

    const titreUpdated = await titreIdUpdate(titreOldId, titre)

    return { [titreUpdated.id]: titreOldId }
  } catch (e) {
    console.error(`erreur: titreOldIdUpdate ${titreOldId}`)
    console.error(e)

    return null
  }
}

interface ITitreIdsIndex {
  [key: string]: string
}

const titresIdsUpdate = async (titres: ITitres[]) => {
  // les transactions `titreIdUpdateQuery` ne peuvent être exécutées en parallèle
  const queue = new PQueue({ concurrency: 1 })

  const titresUpdatedIds = await queue.addAll(
    titres.map(titre => async () => titreIdsUpdate(titre))
  )

  // assemble le tableau d'objets en un dictionnaire
  // supprime les éléments `null`
  const titresUpdatedIndex = titresUpdatedIds.reduce(
    (titresUpdatedIndex: ITitreIdsIndex, titreUpdatedIds) => {
      if (titreUpdatedIds) {
        titresUpdatedIndex = { ...titresUpdatedIndex, ...titreUpdatedIds }
      }

      return titresUpdatedIndex
    },
    {}
  )

  return titresUpdatedIndex
}

export { titresIdsUpdate, titreIdsUpdate, titreIdFindHashAdd }
