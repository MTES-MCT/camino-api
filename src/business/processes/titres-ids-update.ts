import { ITitres } from '../../types'

import * as cryptoRandomString from 'crypto-random-string'
import * as slugify from '@sindresorhus/slugify'

import { titreIdUpdate, titreGet } from '../../database/queries/titres'
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

      // met à jour les ids de titre par effet de bord
      titreIdAndRelationsUpdate(titre, titreIdFindHashAdd(hash))
    } else {
      delete titre.doublonTitreId
    }
  }

  return titre
}

const titreIdsUpdate = async (titre: ITitres) => {
  // les transaction en bdd ne peuvent être effectuées en parallèle
  // comment ça se passe si plusieurs utilisateurs modifient des titres en même temps ?

  const titreOldId = titre.id
  try {
    // met à jour les ids de titre par effet de bord
    titre = titreIdAndRelationsUpdate(titre)

    if (!titre) return null

    titre = await titreIdCheck(titreOldId, titre)
    await titreIdUpdate(titreOldId, titre)
    await titreFichiersRename(titreOldId, titre)

    console.log(`mise à jour: titre ids: ${titre.id}`)

    return { [titre.id]: titreOldId }
  } catch (e) {
    console.error(`erreur: titreIdsUpdate ${titreOldId}`)
    console.error(e)

    return null
  }
}

interface ITitreIdsIndex {
  [key: string]: string
}

const titresIdsUpdate = async (titres: ITitres[]) => {
  // les transactions `titreIdUpdate` ne peuvent être exécutées en parallèle
  const titresUpdatedIndex = {} as ITitreIdsIndex

  for (const titre of titres) {
    const titreUpdatedIndex = await titreIdsUpdate(titre)

    if (titreUpdatedIndex) {
      const titreId = Object.keys(titreUpdatedIndex)[0]
      titresUpdatedIndex[titreId] = titreUpdatedIndex[titreId]
    }
  }

  return titresUpdatedIndex
}

export { titresIdsUpdate, titreIdsUpdate, titreIdFindHashAdd, titreIdCheck }
