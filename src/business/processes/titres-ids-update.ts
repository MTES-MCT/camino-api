import { ITitre } from '../../types'

import * as cryptoRandomString from 'crypto-random-string'
import * as slugify from '@sindresorhus/slugify'

import { titreIdUpdate, titreGet } from '../../database/queries/titres'
import titreIdAndRelationsUpdate from '../utils/titre-id-and-relations-update'
import titreIdFind from '../utils/titre-id-find'
import { titreFilePathsRename } from './titre-fichiers-rename'

const titreIdFindHashAdd = (hash: string) => (titre: ITitre) =>
  slugify(`${titreIdFind(titre)}-${hash}`)

const titreIdCheck = async (titreOldId: string, titre: ITitre) => {
  if (titreOldId !== titre.id) {
    const titreWithTheSameId = await titreGet(titre.id, {}, 'super')

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

const titreIdsUpdate = async (titreOld: ITitre) => {
  // les transaction en bdd ne peuvent être effectuées en parallèle
  // comment ça se passe si plusieurs utilisateurs modifient des titres en même temps ?

  const titreOldId = titreOld.id
  try {
    // met à jour les ids de titre par effet de bord
    const {
      titre,
      hasChanged,
      relationsIdsChangedIndex
    } = titreIdAndRelationsUpdate(titreOld)

    if (!hasChanged) return null

    const titreNew = await titreIdCheck(titreOldId, titre)

    await titreIdUpdate(titreOldId, titreNew)

    // on catch l'erreur pour ne pas interrompre le processus
    try {
      await titreFilePathsRename(relationsIdsChangedIndex, titreNew)
    } catch (e) {
      console.error(
        `erreur: renommage de fichiers ${titreOldId} -> ${titreNew.id}`
      )
    }

    console.info(`mise à jour: titre ids: ${titreNew.id}`)

    return { [titreNew.id]: titreOldId }
  } catch (e) {
    console.error(`erreur: titreIdsUpdate ${titreOldId}`)
    console.error(e)

    return null
  }
}

interface ITitreIdsIndex {
  [key: string]: string
}

const titresIdsUpdate = async (titres: ITitre[]) => {
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
