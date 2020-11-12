import { ITitre } from '../../types'

import * as cryptoRandomString from 'crypto-random-string'
import * as slugify from '@sindresorhus/slugify'

import {
  titreIdUpdate,
  titreGet,
  titresGet
} from '../../database/queries/titres'
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

    // attrape l'erreur pour ne pas interrompre le processus
    try {
      await titreFilePathsRename(relationsIdsChangedIndex, titreNew)
    } catch (e) {
      console.error(
        `erreur: renommage de fichiers ${titreOldId} -> ${titreNew.id}`
      )
    }

    const log = {
      type: 'titre : id (mise à jour) ->',
      value: titreNew.id
    }

    console.info(log.type, log.value)

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

const titresIdsUpdate = async (titresIds?: string[]) => {
  console.info()
  console.info('ids de titres, démarches, étapes et sous-éléments…')
  // si l'id du titre change il est effacé puis re-créé entièrement
  // on doit donc récupérer toutes ses relations
  const titres = await titresGet(
    { ids: titresIds },
    {
      fields: {
        type: { type: { id: {} } },
        references: { id: {} },
        administrationsGestionnaires: { id: {} },
        demarches: {
          etapes: {
            points: { references: { id: {} } },
            documents: { id: {} },
            administrations: { id: {} },
            titulaires: { id: {} },
            amodiataires: { id: {} },
            substances: { id: {} },
            communes: { id: {} },
            justificatifs: { id: {} },
            incertitudes: { id: {} }
          },
          phase: { id: {} }
        },
        travaux: { etapes: { id: {} } },
        activites: { id: {} }
      }
    },
    'super'
  )

  // les transactions `titreIdUpdate` ne peuvent être exécutées en parallèle
  const titresUpdatedIndex = {} as ITitreIdsIndex

  for (const titre of titres) {
    const titreUpdatedIndex = await titreIdsUpdate(titre)

    if (titreUpdatedIndex) {
      Object.assign(titresUpdatedIndex, titreUpdatedIndex)
    }
  }

  return titresUpdatedIndex
}

export { titresIdsUpdate, titreIdFindHashAdd, titreIdCheck }
